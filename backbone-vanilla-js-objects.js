//globals Backbone, _
Backbone.VanillaJsObjects = (function (undefined) {

  var isArray = function(obj) {
    return Object.prototype.toString.apply(obj) === '[object Array]';
  };

  var getType = function(value) {
    if(value === null) {
      return 'null';
    } else if(isArray(value)) {
      return 'array';
    } else {
      return typeof value;
    }
  };

  // var inspect = function(object) {

  // };

  var Property = Backbone.Model.extend({

    // getters
    property: function() {
      return this.get('property');
    },

    value: function() {
      var value = this.get('value');
      if(getType(value) === 'object') {
        return 'Object';
      } else if(getType(value) === 'array') {
        return 'Array';
      } else {
        return '' + value;
      }
    },

    type: function() {
      return getType(this.get('value'));
    }
  });

  var Collection = Backbone.Collection.extend({
    model: Property
  });

  var PropertyView = Backbone.View.extend({
    template: _.template([
      '<% if(property()) { %>',
        '<span class="property">',
          '<%= property() %>',
          // '<span class="colon">: </span>',
        '</span>',
      '<% } %>',
      '<span class="value value-<%= type() %>"><%= value() %></span>'
    ].join('')),

    tagName: 'li',
    className: 'backbone-vanilla-js-object',

    initialize: function() {
      if(this.options.hasOwnProperty('inspect')) {
        this.model = new Backbone.VanillaJsObjects.Property({
          value: this.options.inspect
        });
      }
    },

    render: function() {
      this.$el.html(this.template(this));
      if(this.expandable()) {
        var self = this;
        //TODO that's not optimal
        var cb = function() {
          self.toggle.apply(self, arguments);
        };
        this.$el.on('click', '> .property', cb);
        this.$el.on('click', '> .value', cb);
        this.$el.addClass('expandable');
        this.$el.append('<ul class="" style="display: none">');
      }
      return this;
    },

    //delegates
    property: function() {
      return this.model.property();
    },

    value: function() {
      return this.model.value();
    },

    type: function() {
      return this.model.type();
    },

    expandable: function() {
      if(this.collection) {
        return false;
      } else {
        return this.property() && (this.type() === 'object' || this.type() === 'array');
      }
    },

    expanded: false,

    toggle: function() {
      var ul = this.$el.find('ul');
      if(this.expanded) {
        ul.hide();
        ul.empty();
      } else {
        ul.show();
        new PropertyView({
          el: ul,
          inspect: this.model.get('value')
        }).render();
      }
      this.expanded = ! this.expanded;
      this.$el.toggleClass('expanded', this.expanded);
    }

  });

  var ObjectView = Backbone.View.extend({

    tagName: 'ul',
    className: 'backbone-vanilla-js-object',

    initialize: function() {
      if(this.options.hasOwnProperty('inspect')) {
        var inspect = this.options.inspect;
        if(getType(inspect) === 'object') {
          this.collection = new Collection();
          for(var property in inspect) {
            this.collection.add({ property: property, value: inspect[property] });
          }
        } else if(getType(inspect) === 'array') {
          var collection = this.collection = new Collection();
          _.each(inspect, function(item) {
            collection.add({ value: item });
          });
        }
      }
    },

    render: function() {
      var el = this.$el.empty();
      this.collection.each(function(model) {
        // TODO complete reference for testing purposes, need to find a better way!
        el.append(new Backbone.VanillaJsObjects.Views.Property({
          model: model
        }).render().el);
      });
      return this;
    }
  });

  return {
    Views: {
      Object: ObjectView,
      Property: PropertyView
    },
    Property: Property,
    Object: Collection,
    Array: Collection,
    getType: getType
  };
})();