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
      if(value && typeof value.inspect === 'function') {
        return value.inspect();
      } else if(getType(value) === 'object') {
        return value.constructor.name;
      } else if(getType(value) === 'array') {
        return 'Array';
      } else if(getType(value) === 'function') {
        return value.toString().split('\n')[0];
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
    tagName: 'li',
    className: 'backbone-vanilla-js-property',

    ChildClass: undefined,
    childView: null,

    initialize: function() {
      if(this.options.hasOwnProperty('inspect')) {
        this.model = new Backbone.VanillaJsObjects.Property({
          value: this.options.inspect
        });
      }

      if(this.type() === 'object' || this.type() === 'function') {
        this.ChildClass = ObjectView;
      } else if(this.type() === 'array') {
        this.ChildClass = ArrayView;
      }
    },

    template: _.template([
      '<% if(property()) { %>',
        '<span class="property">',
          '<%= property() %>',
          // '<span class="colon">: </span>',
        '</span>',
      '<% } %>',
      '<span class="value value-<%= type() %>"><%= value() %></span>'
    ].join('')),

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
      return !!this.ChildClass;
    },

    toggle: function() {
      if(this.childView) {
        this.childView.remove();
        this.childView = null;
        this.$el.toggleClass('expanded', false);
      } else {
        this.childView = new this.ChildClass({
          inspect: this.model.get('value')
        });
        this.$el.append(this.childView.render().el);
        this.$el.toggleClass('expanded', true);
      }
    }

  });

  var CollectionView = Backbone.View.extend({
    tagName: 'ul',

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

  var ObjectView = CollectionView.extend({

    tagName: 'ul',
    className: 'backbone-vanilla-js-object',

    initialize: function() {
      if(this.options.hasOwnProperty('inspect')) {
        var inspect = this.options.inspect;
        if(getType(inspect) === 'object' || getType(inspect) === 'function') {
          this.collection = new Collection();
          for(var property in inspect) {
            if(inspect.hasOwnProperty(property)) {
              this.collection.add({ property: property, value: inspect[property] });
            }
            // TODO options.showInherited === true: Add with class .inherited
          }
        }
      }
    }
  });

  var ArrayView = CollectionView.extend({
    tagName: 'ul',
    className: 'backbone-vanilla-js-array',

    initialize: function() {
      if(this.options.hasOwnProperty('inspect')) {
        var inspect = this.options.inspect;
        if(getType(inspect) === 'array') {
          var collection = this.collection = new Collection();
          _.each(inspect, function(item) {
            collection.add({ value: item });
          });
        }
      }
    }
  });

  return {
    Views: {
      Object: ObjectView,
      Array: ArrayView,
      Property: PropertyView
    },
    Property: Property,
    Object: Collection,
    Array: Collection,
    getType: getType
  };
})();