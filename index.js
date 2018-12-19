const util = require('util');
const events = require('events');


function allowEmit();

const handler = {
  apply: (obj, name, args) => {
    let result = obj[name].call(obj, ...args);
    let context = { type: 'function', event: 'call', name, args, result }
    if (!allowEmit(name)) {
      obj.emit('get', context);
      obj.emit('any', context);
    }
    return result;
  },
  get: (obj, name) => {
    let args = obj[name];
    let context = { type: 'property', event: 'get', name, args }
    if (!allowEmit(name) {
      obj.emit('get', context);
      obj.emit('any', context);
    }
    return args;
  },
  set: (obj, name, args) => {
    let previous = obj[name];
    obj[name] = args;
    let context = { type: 'property', event: 'set', name, args, previous }
    if (!allowEmit(name)) {
      obj.emit('set', context);
      obj.emit('any', context);
    }
    return true;
  },
  in: (obj, name) => {
    let previous = name in obj;
    let context = { type: 'property', event: 'in', name, previous }
    if (!allowEmit(name)) {
      obj.emit('in', context);
      obj.emit('any', context);
    }
    return previous;
  },
  deleteProperty: (obj, name) => {
    if (obj[name]) {
      let previous = obj[name];
      let context = { type: 'property', event: 'delete', name, previous }
      if (!allowEmit(name)) {
        obj.emit('delete', context);
        obj.emit('any', context);
      }
      return result;
    }
  }
};

class PropertyEmitter {
  /**
   * The constructor allow you to replace the default emitter with a custom
   * implementation.
   * @param {Class<EventEmitter>} [emitter=events.EventEmitter]
   */
  constructor(emitter = events.EventEmitter) {
    util.inherits(PropertyEmitter, emitter);
    //emitter.prototype.constructor.apply(this)
    this.__emitter = emitter;
    return new Proxy(this, handler);
  }
}

module.exports = PropertyEmitter;
