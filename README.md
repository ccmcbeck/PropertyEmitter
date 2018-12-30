# PropertyEmitter
An event emitter that emit events whenever an object property is accessed

[![npm version](https://badge.fury.io/js/propem.svg)](http://badge.fury.io/js/propem)
[![Build Status](https://travis-ci.org/mallocator/PropertyEmitter.svg?branch=master)](https://travis-ci.org/mallocator/PropertyEmitter)
[![Coverage Status](https://coveralls.io/repos/mallocator/PropertyEmitter/badge.svg?branch=master&service=github)](https://coveralls.io/github/mallocator/PropertyEmitter?branch=master)
[![Dependency Status](https://david-dm.org/mallocator/PropertyEmitter.svg)](https://david-dm.org/mallocator/PropertyEmitter)


## About
This library includes an EventEmitter implementation that you can extend in your
own code if you want to react to property changes or function calls on an object.

The library allows you to register listeners that will be called with information
about what was called with which parameters and what the previous value was.


## Example
This is an example of how to react to a property being set on your own object.

```Javascript
const {PropertyEmitter} = require('propem');

class Example extends PropertyEmitter {
  constructor() {
    super();
  }
}

let example = new Example();
example.emitter.on('set', console.log);

emitter.myprop = "a value"
// => emitter => console.log()
//    {object: !ref, name: "myprop", current: "a value" }
```


## Installation
In your npm project directory run

```
npm i --save propem
```


## How does it work?
This tool makes use of the new [Proxy class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
introduced with ES2015 by wrapping the target object and returning the proxy. All calls
and access are forwarded to the original object while triggering events if any listeners
are present.

This shouldn't interfere in most cases and the object should just behave as usual. However,
due to the custom code running around getting, setting and deleting properties there's
always a chance that special cases exist where behavior might change. Understanding that
you're really dealing with 2 objects, one wrapping the other might help solve some of those
issues.

And as always if you run into any such issues, I'd appreciate some feedback ideally as a 
[Bug Report](https://github.com/mallocator/PropertyEmitter/issues). It might be valuable
information for improving the quality of this library.  


## API
The PropertyEmitter extends all existing [EventEmitter methods and properties](https://nodejs.org/api/events.html#events_class_eventemitter).
As such be careful not to overwrite any existing structures.

### PropertyEmitter.constructor(EventEmitter=null, EmitterName='emitter')
Allows you to set a custom event emitter library. Defaults to the built
in EventEmitter. In any case don't forget to call the super() method in your
own constructor, otherwise you're missing initialization even if you go with
default values.

The constructor also allows you to specify the property under which to find the
emitter. Defaults to 'emitter'.

### watchProperties(object, EventEmitter=null)
In case you need to construct an emitter but can't add an extra property and want
the original object to stay clean you can use this function to get a wrapped object
back that will now emit events on the passed in emitter, without having a reference
on the object itself.

```Javascript
const {watchProperties} = require('propem');
let emitter = new require('events').EventEmitter();
let watched = watchProperties(obj, emitter);

emitter.on('set', console.log);

watched.myprop = "a value"
// => emitter => console.log()
//    {object: !ref, name: "myprop", current: "a value" }
```

### PropertyEmitter.emitter.on(event, listener)
The ```emitter.on()``` method has a few built in events that get fired whenever 
a property is accessed, other than that it is an instance of the passed in EventEmitter
class from the constructor so you can make use of all methods including "on()". 

This is the list of built in events:

* ```set```: Is fired whenever a property is assigned
* ```get```: Is fired whenever a property is accessed
* ```delete```: Is fired when a property is removed
* ```in```: Fires if an *in* operator has been used on the object
* ```any```: Is fired when either a get, set or function is triggered


You can register listeners to these events that react whenever the event get
fired. The arguments passed to the listeners are encapsulated in an object:

```
{
  type: "property",
  name: "myprop",
  event: "function",
  current: "current value",
  previous: "previous value",
  result: "function response"
}
```


## Tests
To run the test you must check out the project code, install all dependencies
via ```npm install```. Once the project is set up you can get coverage reports
and test results simply by running:

```
npm test
```


## Bugs and Feature Requests
I try to find all the bugs and have tests to cover all cases, but since I'm working on this project alone, it's easy to miss something.
Also I'm trying to think of new features to implement, but most of the time I add new features because someone asked me for it.
So please report any bugs or feature request to mallox@pyxzl.net or file an issue directly on [Github](https://github.com/mallocator/PropertyEmitter/issues).
Thanks!
