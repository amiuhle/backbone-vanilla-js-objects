describe("Backbone.VanillaJsObjects", function() {
  var bvo = null;
  var simples = null;
  
  beforeEach(function() {
    bvo = Backbone.VanillaJsObjects;
    simples = [1, "foo", true, false, null, undefined];
  });

  describe("View", function() {
    var view = null;

    it("defines the class", function() {
      expect(bvo.View).toBeDefined();
    });

    it("can be given an Object", function() {
      view = new bvo.View(new Object());
      expect(view.collection).toBeDefined();
      expect(view.collection).toEqual(jasmine.any(bvo.Object));
    });

    it("can be given an Array", function() {
      view = new bvo.View(new Array());
      expect(view.collection).toBeDefined();
      expect(view.collection).toEqual(jasmine.any(bvo.Array));
      console.log(view.collection instanceof bvo.Array);
    });

    describe("can be given simple types", function() {
      simples.forEach(function(simple) {
        it("(" + simple + ")", function() {
          view = new bvo.View(simple);
          expect(view.model).toBeDefined();
          expect(view.model).toEqual(jasmine.any(bvo.Property));
        });
      });
    });

    describe("simple types", function() {

    });
  });
});