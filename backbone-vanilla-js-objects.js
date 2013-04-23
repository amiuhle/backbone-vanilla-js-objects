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

  });

  Backbone.VanillaJsObjects.View = Backbone.View.extend({
    constructor: function(inspectable, options) {
      this.inspectable = inspectable;
      this.options = options;
      if(typeof inspectable === 'object' && inspectable !== null) {
        if(isArray(inspectable)) {
          this.collection = new Backbone.VanillaJsObjects.Array(inspectable);
        } else {
          this.collection = new Backbone.VanillaJsObjects.Object(inspectable);
        }
      } else {
        this.model = new Backbone.VanillaJsObjects.Property(inspectable);
      }
    }
  });
})();