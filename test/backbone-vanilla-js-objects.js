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
        value: new Object()
      });
      expect(view.collection).toBeDefined();
      expect(view.collection).toEqual(jasmine.any(bvo.Object));
    });

    it('can be given an Array', function() {
      view = new View({
        value: new Array()
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
        expect(model.value()).toEqual('1');
        expect(model.type()).toEqual('number');
      });

      it('string', function() {
        var model = new Property({
          value: 'bar'
        });
        expect(model.value()).toEqual('bar');
        expect(model.type()).toEqual('string');
      });

      it('true', function() {
        var model = new Property({
          value: true
        });
        expect(model.value()).toEqual('true');
        expect(model.type()).toEqual('boolean');
      });

      it('false', function() {
        var model = new Property({
          value: false
        });
        expect(model.value()).toEqual('false');
        expect(model.type()).toEqual('boolean');
      });

      it('null', function() {
        var model = new Property({
          value: null
        });
        expect(model.value()).toEqual('null');
        expect(model.type()).toEqual('null');
      });

      it('undefined', function() {
        var model = new Property({
          value: undefined
        });
        expect(model.value()).toEqual('undefined');
        expect(model.type()).toEqual('undefined');
      });

    });
  });
});