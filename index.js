const events = require('events');

/**
 * Returns a proxy that wraps the given object with an event emitter that will fire events whenever properties
 * are accessed.
 * @param {Object} obj            The object to be wrapped
 * @param {EventEmitter} emitter  The event emitter used to emit events
 * @param {string} [emitterName]  The name of the emitter property so we don't fire events on emitter access.
 * @returns {Object}              The proxyfied object
 */
function getProxy (obj, emitter, emitterName) {
  return new Proxy(obj, {
    get: (object, name) => {
      let current = object[name];
      if (emitter.listenerCount('get') > 0) {
        let context = {object, event: 'get', name, current};
        if (name !== emitterName) {
          emitter.emit('get', context);
          emitter.emit('any', context);
        }
      }
      return current;
    },
    set: (object, name, current) => {
      if (emitter.listenerCount('set') === 0) {
        return object[name] = current;
      }
      let previous = object[name];
      object[name] = current;
      let context = {object, event: 'set', name, current, previous};
      if (name !== emitterName) {
        emitter.emit('set', context);
        emitter.emit('any', context);
      }
      return true;
    },
    has: (object, name) => {
      if (emitter.listenerCount('in') > 0) {
        let current = name in object;
        let context = {object, event: 'in', name, current};
        if (name !== emitterName) {
          emitter.emit('in', context);
          emitter.emit('any', context);
        }
      }
      return name in object;
    },
    deleteProperty: (obj, name) => {
      if (emitter.listenerCount('delete') === 0) {
        return delete obj[name];
      }
      if (Reflect.has(obj, name)) {
        let previous = obj[name];
        let context = {event: 'delete', name, previous};
        delete obj[name];
        if (name !== emitterName) {
          emitter.emit('delete', context);
          emitter.emit('any', context);
        }
        return true;
      }
    },
  });
}

class PropertyEmitter {
  /**
   * The constructor allows you to replace the default emitter with a custom implementation, as well as setting
   * the property name for the emitter.
   * @param {EventEmitter} [emitter=new events.EventEmitter()] The event emitter instance to be used for emitting
   *   events.
   * @param {string} [emitterName='emitter'] The name under which the emitter can be accessed.
   */
  constructor ({emitter = new events.EventEmitter(), emitterName = 'emitter'} = {}) {
    this[emitterName] = emitter;
    return getProxy(this, emitter, emitterName);
  }
}

/**
 *  This function allows you to wrap an existing object in a Proxy that will fire events on the passed in
 *  emitter whenever properties are accessed. This method is useful for when you need to keep your original
 *  object unmodified and don't want an emitter property on it.
 * @param object
 * @param emitter
 */
function watchProperties (object, emitter) {
  return getProxy(object, emitter);
}

exports.PropertyEmitter = PropertyEmitter;
exports.watchProperties = watchProperties;
