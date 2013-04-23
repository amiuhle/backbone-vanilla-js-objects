(function () {

  var isArray = function(obj) {
    return Object.prototype.toString.apply(obj) === '[object Array]'
  };

  var getType = function(value) {
    if(value === null) {
      return 'null';
    } else if(isArray(value)) {
      return 'array';
    } else {
      return typeof value
    }
  };

  Backbone.VanillaJsObjects = {
    getType: getType
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

  Backbone.VanillaJsObjects.View = Backbone.View.extend({
    initialize: function() {
      this.property = this.options.property;
      var value = this.value = this.options.value;
      if(getType(value) === 'object') {
        this.collection = new Backbone.VanillaJsObjects.Object(value);
      } else if(getType(value) === 'array') {
        this.collection = new Backbone.VanillaJsObjects.Array(value);
      } else {
        this.model = new Backbone.VanillaJsObjects.Property(value);
      }
    }
  });
})();