(function () {
  Backbone.VanillaJsObjects = {};
  Backbone.VanillaJsObjects.View = Backbone.View.extend({
    constructor: function(inspectable) {
      this.inspectable = inspectable;
    };
  });
})();