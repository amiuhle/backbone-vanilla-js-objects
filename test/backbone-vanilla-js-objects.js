describe("Backbone.VanillaJsObjects", function() {
  var bvo = null;
  beforeEach(function() {
    bvo = Backbone.VanillaJsObjects;
  })
  describe("View", function() {
    var view = null;

    it("defines the class", function() {
      expect(bvo.View).toBeDefined();
    });

    it("can be given an Object", function() {
      view = new bvo.View(new Object());
      expect(view.collection).toBeDefined();
    });
  });
});