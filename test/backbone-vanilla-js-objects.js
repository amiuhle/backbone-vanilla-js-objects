describe('Backbone.VanillaJsObjects', function() {
  var bvo = null;
  var simples = [1, 'foo', true, false, null, undefined];
  
  beforeEach(function() {
    bvo = Backbone.VanillaJsObjects;
    simples = [1, 'foo', true, false, null, undefined];
  });

  describe('View', function() {
    var View = null;
    var view = null;

    beforeEach(function() {
      View = bvo.View;
    });

    it('defines the class', function() {
      expect(View).toBeDefined();
    });

    it('can be given an Object', function() {
      view = new View({
        value: {}
      });
      expect(view.collection).toBeDefined();
      expect(view.collection).toEqual(jasmine.any(bvo.Object));
    });

    it('can be given an Array', function() {
      view = new View({
        value: []
      });
      expect(view.collection).toBeDefined();
      expect(view.collection).toEqual(jasmine.any(bvo.Array));
    });

    describe('can be given simple types', function() {
      simples.forEach(function(simple) {
        it('(' + simple + ')', function() {
          view = new View({
            value: simple
          });
          expect(view.model).toBeDefined();
          expect(view.model).toEqual(jasmine.any(bvo.Property));
        });
      });
    });
  });

  describe('Property', function() {
    var Property = null;

    beforeEach(function() {
      Property = bvo.Property;
    });

    it('provides getters', function() {
      var model = new Property();
      expect(model.property).toBeDefined();
      expect(model.value).toBeDefined();
      expect(model.type).toBeDefined();
    });

    it('delegates the property', function() {
      expect(new Property({
        property: 'foo'
      }).property()).toBe('foo');
    });

    describe('types:', function() {
      it('number', function() {
        var model = new Property({
          value: 1
        });
        expect(model.value()).toBe('1');
        expect(model.type()).toBe('number');
      });

      it('string', function() {
        var model = new Property({
          value: 'bar'
        });
        expect(model.value()).toBe('bar');
        expect(model.type()).toBe('string');
      });

      it('true', function() {
        var model = new Property({
          value: true
        });
        expect(model.value()).toBe('true');
        expect(model.type()).toBe('boolean');
      });

      it('false', function() {
        var model = new Property({
          value: false
        });
        expect(model.value()).toBe('false');
        expect(model.type()).toBe('boolean');
      });

      it('null', function() {
        var model = new Property({
          value: null
        });
        expect(model.value()).toBe('null');
        expect(model.type()).toBe('null');
      });

      it('undefined', function() {
        var model = new Property({
          value: undefined
        });
        expect(model.value()).toBe('undefined');
        expect(model.type()).toBe('undefined');
      });

    });
  });
});