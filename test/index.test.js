const expect = require('chai').expect;
const EventEmitter = require('events').EventEmitter;
const PropertyEmitter = require('..');

describe("PropertyEmitter", () => {
  it('should allow you to instantiate an emitter', () => {
    let emitter = new PropertyEmitter();
    expect(emitter).to.be.instanceOf(new Proxy({}, {}).constructor);
  });

  it('should allow you to extend a PropertyEmitter', () => {
    class TestClass extends PropertyEmitter {
      constructor() { super(); }
      get prop() { return "test"; }
    }

    let emitter = new TestClass();
    expect(emitter).to.be.instanceOf(new Proxy({}, {}).constructor);
    expect(emitter).to.be.instanceOf(EventEmitter);
  });

  it('should still be a standard EventEmitter', done => {
    let emitter = new PropertyEmitter();
    emitter.once('test', () => done());
    emitter.emit('test');
  });

  it('should emit an event when a property is accessed', done => {
    class TestClass extends PropertyEmitter {
      constructor() { super(); }
      get prop() { return "test"; }
    }

    let emitter = new TestClass();
    emitter.once('get', context => {
      expect(context.type).equals('property');
      expect(context.event).equals('get');
      expect(context.name).equals('prop');
      expect(context.prvious).equals('test');
    });
    emitter.prop;
  });

  it.skip('should emit an even when a property is assigned', done => {
    let emitter = new PropertyEmitter();
    emitter.once('set', context => {
      expect(context.type).equals('property');
      expect(context.event).equals('set');
      expect(context.name).equals('testProp');
      expect(context.args).equals('test');
      done();
    })
    emitter.testProp = "test";
  });
});
