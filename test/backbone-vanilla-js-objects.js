describe('Backbone.VanillaJsObjects', function() {
  var bvo = null;
  var simples = [1, 'foo', true, false, null, undefined];
  
  beforeEach(function() {
    bvo = Backbone.VanillaJsObjects;
    simples = [1, 'foo', true, false, null, undefined];
  });

  it("it detects the correct object type", function () {
    expect(bvo.getType(1)).toBe('number');
    expect(bvo.getType('bar')).toBe('string');
    expect(bvo.getType(true)).toBe('boolean');
    expect(bvo.getType(false)).toBe('boolean');
    expect(bvo.getType(null)).toBe('null');
    expect(bvo.getType(undefined)).toBe('undefined');
    expect(bvo.getType({})).toBe('object');
    expect(bvo.getType([])).toBe('array');
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
        inspect: {}
      });
      expect(view.collection).toBeDefined();
      expect(view.collection).toEqual(jasmine.any(bvo.Object));
    });

    it('can be given an Array', function() {
      view = new View({
        inspect: []
      });
      expect(view.collection).toBeDefined();
      expect(view.collection).toEqual(jasmine.any(bvo.Array));
    });

    describe('can be given simple types', function() {
      simples.forEach(function(simple) {
        it('(' + simple + ')', function() {
          view = new View({
            inspect: simple
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

      it('Object', function() {
        var model = new Property({
          value: {}
        });
        expect(model.value()).toBe('Object');
        expect(model.type()).toBe('object');
      });

      it('Array', function() {
        var model = new Property({
          value: []
        });
        expect(model.value()).toBe('Array');
        expect(model.type()).toBe('array');
      });

    });
  });
});