const expect = require('chai').expect;
const EventEmitter = require('events').EventEmitter;
const EventEmitter3 = require('eventemitter3');
const {PropertyEmitter, watchProperties} = require('..');

describe("PropertyEmitter", () => {
  class TestClass extends PropertyEmitter {
    constructor () { super(); }
    
    get prop () { return 'test'; }
  }
  
  it('should allow you to instantiate an emitter', () => {
    let obj = new PropertyEmitter();
    expect(obj).to.be.instanceOf(new Proxy({}, {}).constructor);
  });

  it('should allow you to extend a PropertyEmitter', () => {
    let obj = new TestClass();
    expect(obj).to.be.instanceOf(new Proxy({}, {}).constructor);
    expect(obj.emitter).to.be.instanceOf(EventEmitter);
  });

  it('should still be a standard EventEmitter', done => {
    let obj = new PropertyEmitter();
    obj.emitter.once('test', () => done());
    obj.emitter.emit('test');
  });
  
  it('should work with a different name for the emitter', () => {
    let obj = new PropertyEmitter({emitterName: 'myEmitter'});
    expect(obj.myEmitter).to.be.instanceOf(EventEmitter);
  });
  
  it('should work with a custom event emitter', done => {
    let obj = new PropertyEmitter({emitter: new EventEmitter3()});
    expect(obj.emitter).to.be.instanceOf(EventEmitter3);
    obj.emitter.once('test', () => done());
    obj.emitter.emit('test');
  });

  it('should emit an event when a property is accessed', done => {
    let obj = new TestClass();
    obj.emitter.once('get', context => {
      expect(context.event).equals('get');
      expect(context.name).equals('prop');
      expect(context.previous).to.be.undefined;
      done();
    });
    obj.prop;
  });
  
  it('should emit an even when a property is assigned', done => {
    let obj = new PropertyEmitter();
    obj.emitter.once('set', context => {
      expect(context.event).equals('set');
      expect(context.name).equals('testProp');
      expect(context.current).equals('test');
      expect(obj.testProp).to.equal('test');
      done();
    });
    obj.testProp = 'test';
  });
  
  it('should emit an event when a property is deleted', done => {
    let obj = new PropertyEmitter();
    obj.emitter.once('delete', context => {
      expect(context.event).equals('delete');
      expect(context.name).equals('testProp');
      expect(context.previous).equals('test');
      expect(obj.testProp).to.be.undefined;
      done();
    });
    obj.testProp = 'test';
    delete obj.testProp;
  });
  
  it('should emit an event when used with the "in" operator', done => {
    let obj = new PropertyEmitter();
    obj.emitter.once('in', context => {
      expect(context.event).equals('in');
      expect(context.name).equals('test');
      expect(context.current).to.be.false;
      done();
    });
    'test' in obj;
  });
});

describe('watchProperties', () => {
  it('should allow you to create a watched object without adding a property', done => {
    let obj = {};
    let emitter = new EventEmitter();
    let watched = watchProperties(obj, emitter);
    emitter.on('set', context => {
      expect(context.event).equals('set');
      expect(context.name).equals('testProp');
      expect(context.current).equals('test');
      expect(obj.testProp).to.equal('test');
      done();
    });
    watched.testProp = 'test';
  });
});