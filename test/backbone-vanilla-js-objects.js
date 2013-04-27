//globals describe, it, expect, beforeEach, Backbone, _, jasmine, spyOn
describe('Backbone.VanillaJsObjects', function() {
  var bvo = null;
  var simples = [1, 'foo', true, false, null, undefined];
  var object = null;
  var array = null;

  beforeEach(function() {
    bvo = Backbone.VanillaJsObjects;
    simples = [1, 'foo', true, false, null, undefined];
    object = {a: 1, b: 'foo', c: true, d: false, e: null, f: undefined, g: { foo: 'bar' }, h: simples};
    array = [1, 'foo', true, false, null, undefined, {foo: 'bar'}, simples];
  });

  it('it detects the correct object type', function () {
    expect(bvo.getType(1)).toBe('number');
    expect(bvo.getType('bar')).toBe('string');
    expect(bvo.getType(true)).toBe('boolean');
    expect(bvo.getType(false)).toBe('boolean');
    expect(bvo.getType(null)).toBe('null');
    expect(bvo.getType(undefined)).toBe('undefined');
    expect(bvo.getType(function(){})).toBe('function');
    expect(bvo.getType({})).toBe('object');
    expect(bvo.getType([])).toBe('array');
  });

  describe('Views.Property', function() {
    var View = null;
    var view = null;

    beforeEach(function() {
      View = bvo.Views.Property;
    });

    it('defines the class', function() {
      expect(View).toBeDefined();
    });

    describe('simple types', function() {
      simples.forEach(function(simple) {
        it('(' + simple + ')', function() {
          view = new View({
            inspect: simple
          });
          expect(view.model).toBeDefined();
          expect(view.model).toEqual(jasmine.any(bvo.Property));
          expect(view.model.property()).not.toBeDefined();
          expect(view.model.get('value')).toBe(simple);
        });
      });
    });

    // describe('Backbone', function() {
    //   it('can be given a Collection', function() {
    //     var collection = new Backbone.Collection();
    //     view = new View({ collection: collection });
    //     expect(view.collection).toBe(collection);
    //   });

    //   it('can be given a Model', function() {
    //     var model = new Backbone.Model();
    //     view = new View({ model: model });
    //     expect(view.model).toBe(model);
    //   });
    // });

    describe('rendering', function() {
      var View = null;
      var Property = null;
      var view = null;

      beforeEach(function() {
        View = bvo.Views.Property;
        Property = bvo.Property;
      });

      describe('Model', function() {
        var model = null;

        beforeEach(function() {
          model = new Property({ property: 'foo', value: 'bar' });
        });

        it('displays property and value', function() {
          view = new View({ model: model }).render();
          var el = view.$el,
            property = el.find('.property'),
            value = el.find('.value');

          expect(el).toBe('li');
          // expect(el).toHaveText('foo: "bar"');

          expect(property).toHaveText(/foo/);
          expect(value).toHaveText(/bar/);
          expect(value).toHaveClass('value-string');

        });

        it('can be used without a property', function() {
          model.set('property', undefined);
          view = new View({ model: model }).render();
          expect(view.$el).not.toContain('.property');
        });

        it('is not expandable', function() {
          view = new View({ model: model }).render();
          expect(view.$el).not.toHaveClass('expandable');
        });

      });

      describe('expandable', function() {

        it('is expandable', function() {
          view = new View({
            model: new bvo.Property({ property: 'foo', value: object })
          });
          expect(view.expandable()).toBe(true);
          var el = view.render().$el;
          expect(el).toHaveClass('expandable');
          // expect(el).toContain('ul');
          // var ul = el.find('ul');
          // expect(ul).toBeEmpty();
          // expect(ul).toBeHidden();

          view = new View({
            model: new bvo.Property({ property: 'foo', value: array })
          });
          expect(view.expandable()).toBe(true);
          el = view.render().$el;
          expect(el).toHaveClass('expandable');
          // expect(el).toContain('ul');
          // ul = el.find('ul');
          // expect(ul).toBeEmpty();
          // expect(ul).toBeHidden();

        });

        // it('expands', function() {
        //   var eventSpy;
        //   // View = bvo.View.extend({
        //   //   initialize: function() {
        //   //     eventSpy = spyOn(this, 'expand').andCallThrough();
        //   //     bvo.View.prototype.initialize.apply(this, arguments);
        //   //   }
        //   // });
        //   view = new View({
        //     model: new bvo.Property({ property: 'foo', value: object })
        //   }).render();

        //   eventSpy = spyOn(view, 'expand').andCallThrough();
        //   expect(eventSpy).not.toHaveBeenCalled();

        //   view.$el.click();
        //   expect(eventSpy).toHaveBeenCalled();


        // });

      });
    });
  });

  describe('Views.Object', function() {
    var View = null;
    var view = null;

    beforeEach(function() {
      View = bvo.Views.Object;
      view = new View({
        inspect: object
      });
    });

    it('defines the class', function() {
      expect(View).toBeDefined();
    });

    it('can be given an Object', function() {
      expect(view.collection).toBeDefined();
      expect(view.collection).toEqual(jasmine.any(bvo.Object));
    });

    it('creates a model for each property', function() {
      var collection = view.collection;
      expect(collection.size()).toBe(8);
      var keys = _.keys(object);
      for(var i = 0; i < keys.length; i++) {
        var property = keys[i];
        var actual = collection.at(i);
        var expected = object[property];
        expect(actual).toEqual(jasmine.any(bvo.Property));
        expect(actual.property()).toBe(property);
        expect(actual.get('value')).toBe(expected);
      }
    });

    describe('rendering', function() {
      
      it('creates a view for each property', function() {
        view = new View({ inspect: object });
        var spy = spyOn(bvo.Views, 'Property').andReturn({
          render: function() {
            return {
              el: ''
            };
          }
        });
        view.render();
        expect(spy).toHaveBeenCalled();
        expect(spy.callCount).toBe(8);
      });

      it('Object', function() {
        view = new bvo.Views.Object({ inspect: object }).render();
        expect(view.$el.find('li').length).toBe(8);
        expect(view.$el.find('li .property').length).toBe(8);
        expect(view.$el.find('li .value').length).toBe(8);
      });
    });
  });

  describe('Views.Array', function() {

    var View = null;
    var view = null;

    beforeEach(function() {
      View = bvo.Views.Array;
      view = new View({
        inspect: array
      });
    });

    it('can be given an Array', function() {
      expect(view.collection).toBeDefined();
      expect(view.collection).toEqual(jasmine.any(bvo.Array));
    });

    it('creates a model for each member', function() {
      var collection = view.collection;
      expect(collection.size()).toBe(8);
      for(var i = 0; i < array.length; i++) {
        var actual = collection.at(i);
        var expected = array[i];
        expect(actual).toEqual(jasmine.any(bvo.Property));
        expect(actual.property()).not.toBeDefined();
        expect(actual.get('value')).toBe(expected);
      }
    });

    describe('rendering', function() {

      it('creates a view for each property', function() {
        view = new View({ inspect: array });
        var spy = spyOn(bvo.Views, 'Property').andReturn({
          render: function() {
            return {
              el: ''
            };
          }
        });
        view.render();
        expect(spy).toHaveBeenCalled();
        expect(spy.callCount).toBe(8);
      });

      it('Array', function() {
        view = new View({ inspect: array }).render();
        expect(view.$el.find('li').length).toBe(8);
        expect(view.$el.find('li .property').length).toBe(0);
        expect(view.$el.find('li .value').length).toBe(8);
      });

    });

  });

  
    // it('is not expandable', function() {
    //   view = new View({ inspect: object });
    //   expect(view.expandable()).toBe(false);
    //   expect(view.render().$el).not.toHaveClass('expandable');

    //   view = new View({ inspect: array });
    //   expect(view.expandable()).toBe(false);
    //   expect(view.render().$el).not.toHaveClass('expandable');

    //   view = new View({
    //     model: new bvo.Property({ property: 'foo', value: 'bar' })
    //   });
    //   expect(view.expandable()).toBe(false);
    //   expect(view.render().$el).not.toHaveClass('expandable');
    // });


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