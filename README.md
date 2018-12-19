# PropertyEmitter
An event emitter that emit events whenever an object property is accessed

[![npm version](https://badge.fury.io/js/PropertyEmitter.svg)](http://badge.fury.io/js/PropertyEmitter)
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
const PropertyEmitter = require('propem');

class Example extends PropertyEmitter {
  constructor() {
    super();
  }
}

let emitter = new Example();
emitter.on('set', console.log);

emitter.myprop = "a value"
// => emitter => console.log()
//    { type: "property", name: "myprop", args: ["a value"], previous: null }
```


## Installation

In your npm project directory run

```
npm i --save propem
```


## API

The PropertyEmitter extends all existing [EventEmitter methods and properties](https://nodejs.org/api/events.html#events_class_eventemitter).
As such be careful not to overwrite any existing structures.

### PropertyEmitter.constructor(EventEmitter=null)

Allows you to set a custom event emitter library. Defaults to the built
in EventEmitter. In any case don't forget to call the super() method in your
own constructor, otherwise you're missing initialization even if you go with
default values.

### PropertyEmitter.on(event, listener)

The ```on()``` method has a few built in events that get fired whenever a
property is accessed.

This is the list of built in events:

* ```set```: Is fired whenever a property is assigned
* ```get```: Is fired whenever a property is accessed
* ```function```: Is fired whenever a function is called
* ```any```: Is fired when either a get, set or function is triggered
* ```in```: Fires if an *in* operator has been used on the object
* ```delete```: Is fired when a property or function is removed (TBD)


You can register listeners to these events that react whenever the event get
fired. The arguments passed to the listeners are encapsulated in an object:

```
{
  type: "property",
  name: "myprop",
  event: "function",
  args: ["arg 1", "arg 2", "arg 3"],
  previous: ["previous arg 1", "previous arg 2"],
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
