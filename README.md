[![Build Status](https://travis-ci.org/vanioinformatika/node-heartbeat.svg?branch=master)](https://travis-ci.org/vanioinformatika/node-heartbeat)
[![Coverage Status](https://coveralls.io/repos/github/vanioinformatika/node-heartbeat/badge.svg)](https://coveralls.io/github/vanioinformatika/node-heartbeat)
[![NPM Version](https://img.shields.io/npm/v/@vanioinformatika/heartbeat.svg)](https://www.npmjs.com/package/@vanioinformatika/heartbeat)
[![npm](https://img.shields.io/npm/l/express.svg)]()

# node-heartbeat
Application heartbeat that emits process / system stats periodically

## Usage

```js
const heartbeat = require('@vanioinformatika/heartbeat')

const processTitle = 'my_process'
const id = uuid.v4()
const appState = () => {
  return myAppStateHandler.queryAppState() // query your application state from whatever source 
}
const callback = (beatObject) => {
  mySpecificLogger.info('heartbeat', beatObject)
}
const interval = 60000 // 1 minute

heartbeat.start() // start beating when the application starts

...

heartbeat.stop() // stop beating when the application stops

```

## API

### Factory

```js
heartbeat(title: string, id: string, appState: Function, callback: Function, [interval: number = 60000]): Heartbeat
```

Parameters:
* title: String, process title
* id: String, unique id of the process (in case of dockerized application it would be the container ID as the process ID is always 1)
* appState: Function, should return any application specific state descriptor object. Its return value will appear in the heartbeat object with `state` key.
* callback: Function, this will be called periodically on every heartbeat, it has one parameter, the beatObject thet contains the process info
* interval: Number, the heartbeat interval in milliseconds (default: 60000 i.e. 1 min)

### start

```js
start(): void
```

Starts the heartbeat scheduler.

### stop

```js
stop(): void
```

Starts the heartbeat scheduler.

### beat

```js
beat(): void
```

The actual heartbeat emitter function that creates the beat object and calls the callback. It can be useful if an extra heartbeat is required.
