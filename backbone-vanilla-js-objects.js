(function () {
  Backbone.VanillaJsObjects = {};

  var isArray = function(obj) {
    return Object.prototype.toString.apply(obj) === '[object Array]'
  };

  Backbone.VanillaJsObjects.Object = Backbone.Collection.extend({

  });

  Backbone.VanillaJsObjects.Array = Backbone.Collection.extend({

  });
  
  Backbone.VanillaJsObjects.Property = Backbone.Model.extend({

    // getters
    property: function() {
      return this.get('property');
    },

    value: function() {
      return '' + this.get('value');
    },

    type: function() {
      var value = this.get('value');
      if(value === null) {
        return 'null';
      } else {
        return typeof value;
      }
    }
  });

  Backbone.VanillaJsObjects.View = Backbone.View.extend({
    initialize: function() {
      this.property = this.options.property;
      var value = this.value = this.options.value;
      if(typeof value === 'object' && value !== null) {
        if(isArray(value)) {
          this.collection = new Backbone.VanillaJsObjects.Array(value);
        } else {
          this.collection = new Backbone.VanillaJsObjects.Object(value);
        }
      } else {
        this.model = new Backbone.VanillaJsObjects.Property(value);
      }
    }
  });
})();