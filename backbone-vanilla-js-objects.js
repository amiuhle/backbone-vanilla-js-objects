//globals Backbone, _
(function () {

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

  Backbone.VanillaJsObjects = {
    getType: getType
  };

  Backbone.VanillaJsObjects.Property = Backbone.Model.extend({

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
      } else if(getType(value) === 'string') {
        return '"' + value + '"';
      } else {
        return '' + value;
      }
    },

    type: function() {
      return getType(this.get('value'));
    }
  });

  Backbone.VanillaJsObjects.Object = Backbone.Collection.extend({
    model: Backbone.VanillaJsObjects.Property
  });

  Backbone.VanillaJsObjects.Array = Backbone.Collection.extend({
    model: Backbone.VanillaJsObjects.Property
  });

  Backbone.VanillaJsObjects.View = Backbone.View.extend({
    initialize: function() {
      if(this.options.hasOwnProperty('inspect')) {
        var inspect = this.options.inspect;
        if(getType(inspect) === 'object') {
          this.collection = new Backbone.VanillaJsObjects.Object();
          for(var property in inspect) {
            this.collection.add({ property: property, value: inspect[property] });
          }
        } else if(getType(inspect) === 'array') {
          var collection = this.collection = new Backbone.VanillaJsObjects.Array();
          _.each(inspect, function(item) {
            collection.add({ value: item });
          });
        } else {
          this.model = new Backbone.VanillaJsObjects.Property({
            value: inspect
          });
        }
      }
    },

    tagName: 'li',
    template: _.template([
      '<% if(property()) { %>',
        '<span class="property">',
          '<%= property() %>',
          '<span class="colon">: </span>',
        '</span>',
      '<% } %>',
      '<span class="value"><%= value() %></span>'
    ].join('')),

    render: function() {
      if(this.collection) {
        var el = this.$el.empty();
        this.collection.each(function(model) {
          el.append(new Backbone.VanillaJsObjects.View({
            model: model
          }).render().el);
        });
      } else {
        this.$el.html(this.template(this));
        if(this.expandable()) {
          this.$el.addClass('expandable');
          this.$el.append('<ul style="display: none">');
        }
      }
      return this;
    },

    events: {
      'click': 'expand'
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
        return this.property() && (this.type() === 'object' || this.type() === 'array')
      }
    },

    expand: function() {
      console.log('expand', this, arguments);
    }


  });
})();