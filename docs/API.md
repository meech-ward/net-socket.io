
## Table of Contents

  - [Class: Server](#server)
    - [new Server(path[, options])](#new-serverpath-options)
    - [new Server(port[, options])](#new-serverport-options)
    - [new Server(options)](#new-serveroptions)
    - [server.sockets](#serversockets)
    - [server.close([callback])](#serverclosecallback)
  - [Class: Socket](#socket)
    - [new Socket(path)](#new-socketpath)
    - [new Socket(port[, host])](#new-socketport-host)
    - [socket.id](#socketid)
    - [socket.use(fn)](#socketusefn)
    - [socket.send([...args][, ack])](#socketsendargs-ack)
    - [socket.emit(eventName[, ...args][, ack])](#socketemiteventname-args-ack)
    - [socket.on(eventName, callback)](#socketoneventname-callback)
    - [socket.once(eventName, listener)](#socketonceeventname-listener)
    - [socket.removeListener(eventName, listener)](#socketremovelistenereventname-listener)
    - [socket.removeAllListeners([eventName])](#socketremovealllistenerseventname)
    - [socket.eventNames()](#socketeventnames)
    - [socket.compress(value)](#socketcompressvalue)
    - [socket.disconnect(close)](#socketdisconnectclose)
    - [Flag: 'broadcast'](#flag-broadcast)
    - [Flag: 'volatile'](#flag-volatile-1)
    - [Flag: 'binary'](#flag-binary-1)
    - [Event: 'disconnect'](#event-disconnect)
    - [Event: 'error'](#event-error)
    - [Event: 'disconnecting'](#event-disconnecting)



### Server

Exposed by `require('net-socket.io').Server`.

#### new Server(path[, options]) **NOT IMPLEMENTED**

Creates a new IPC server.

  - `path` _(String)_: The complete path where a socket file will be created. (IPC)
  - `options` _(Object)_
    - `allowHalfOpen` _(Boolean)_: Indicates whether half-opened TCP connections are allowed. Default: false.
    - `pauseOnConnect` _(Boolean)_: Indicates whether the socket should be paused on incoming connections. Default: false.
    - `backlog` _(Number)_: specify the maximum length of the queue of pending connections. The actual length will be determined by the OS through `sysctl` settings such as `tcp_max_syn_backlog` and `somaxconn` on Linux. The default value of this parameter is 511 (not 512).
    - `host` _(String)_: Only applies when `port` is set. If host is omitted, the server will accept connections on the unspecified IPv6 address (::) when IPv6 is available, or the unspecified IPv4 address (0.0.0.0) otherwise.

Works with and without `new`:

```js
const { Server } = require('net-socket.io');
const io = Server('/tmp/socket');
// or
const io = require('socket.io').Server('tmp/socket');
```

#### new Server(port[, options]) **NOT IMPLEMENTED**

Creates a new TCP server.

  - `port` _(Number)_: The port that will be opened for TCP connections.
  - See [above](#new-serverhttpserver-options) for available options.

```js
const { Server } = require('net-socket.io');
const io = Server(5000);
```

#### server.sockets **NOT IMPLEMENTED**

All of the connected sockets.


#### server.close([callback]) **NOT IMPLEMENTED**

  - `callback` _(Function)_

Closes the server. The `callback` argument is optional and will be called when all connections are closed. If this is an IPC server, it will also remove the socket file.

```js
const Server = require('net-socket.io');
const PORT   = 3030;
const io = Server(PORT);

io.close(); // Close current server
```

---

### Socket

Exposed by `require('net-socket.io').Socket`.

A `Socket` is the fundamental class for interacting with clients and the server. 

It should be noted the `Socket` is just a thing wrapper around the actual underlying TCP/IP `socket`. 

The `Socket` class inherits from [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter). The `Socket` class overrides the `emit` method, and does not modify any other `EventEmitter` method. All methods documented here which also appear as `EventEmitter` methods (apart from `emit`) are implemented by `EventEmitter`, and documentation for `EventEmitter` applies.

#### new Socket(path) **NOT IMPLEMENTED**

> You will only construct a socket when connecting as a client. When creating a `Server`, you will not create sockets yourself, the Server will create them for you.

Creates a new IPC client socket.

  - `path` _(String)_: The complete path where a socket file will be created. (IPC)


Works with and without `new`:

```js
const { Socket } = require('net-socket.io');
const socket = Socket('/tmp/socket');
// or
const socket = require('socket.io').Socket('tmp/socket');
```

* Returns: _(Socket)_ The newly created socket used to start the connection.

#### new Socket(port[, host]) **NOT IMPLEMENTED**

Creates a new TCP client socket.

  - `port` _(Number)_: The port that will be opened for TCP connections.
  - `host` _(String)_

```js
const { Socket } = require('net-socket.io');
const socket = Socket(5000);
```

#### socket.id **NOT IMPLEMENTED**

  * _(String)_

A unique identifier for the session.

#### socket.netSocket **NOT IMPLEMENTED**

  * _(net.Socket)_

A reference to the underlying [`net.Socket`](https://nodejs.org/api/net.html#net_class_net_socket).

#### socket.use(fn) **NOT IMPLEMENTED**

  - `fn` _(Function)_

Registers a middleware, which is a function that gets executed for every incoming message and receives as parameter the packet and a function to optionally defer execution to the next registered middleware.

Errors passed to middleware callbacks are sent as special `error` packets to clients.

```js
io.on('connection', (socket) => {
  socket.use((packet, next) => {
    if (packet.doge === true) return next();
    next(new Error('Not a doge error'));
  });
});
```

#### socket.send([...args][, ack]) **NOT IMPLEMENTED**

  - `args`
  - `ack` _(Function)_
  - **Returns** `Socket`

Sends a `message` event. See [socket.emit(eventName[, ...args][, ack])](#socketemiteventname-args-ack).

#### socket.emit(eventName[, ...args][, ack]) **NOT IMPLEMENTED**

*(overrides `EventEmitter.emit`)*
  - `eventName` _(String)_
  - `args`
  - `ack` _(Function)_
  - **Returns** `Socket`

Emits an event to the socket identified by the string name. Any other parameters can be included. All serializable datastructures are supported, including `Buffer`.

```js
socket.emit('hello', 'world');
socket.emit('with-binary', 1, '2', { 3: '4', 5: new Buffer(6) });
```

The `ack` argument is optional and will be called with the receiver's answer.

```js
io.on('connection', (socket) => {
  socket.emit('an event', { some: 'data' });

  socket.emit('ferret', 'tobi', (data) => {
    console.log(data); // data will be 'woot'
  });

  // the receiver's code
  // socket.on('ferret', (name, fn) => {
  //   fn('woot');
  // });

});
```

#### socket.on(eventName, callback) **NOT IMPLEMENTED**

*(inherited from `EventEmitter`)*
  - `eventName` _(String)_
  - `callback` _(Function)_
  - **Returns** `Socket`

Register a new handler for the given event.

```js
socket.on('news', (data) => {
  console.log(data);
});
// with several arguments
socket.on('news', (arg1, arg2, arg3) => {
  // ...
});
// or with acknowledgement
socket.on('news', (data, callback) => {
  callback(0);
});
```

#### socket.once(eventName, listener) **NOT IMPLEMENTED**
#### socket.removeListener(eventName, listener) **NOT IMPLEMENTED**
#### socket.removeAllListeners([eventName]) **NOT IMPLEMENTED**
#### socket.eventNames() **NOT IMPLEMENTED**

Inherited from `EventEmitter` (along with other methods not mentioned here). See Node.js documentation for the `events` module.

#### socket.compress(value) **NOT IMPLEMENTED**

  - `value` _(Boolean)_ whether the following packet will be compressed
  - **Returns** `Socket` for chaining

Sets a modifier for a subsequent event emission that the event data will only be _compressed_ if the value is `true`. Defaults to `true` when you don't call the method.

```js
io.on('connection', (socket) => {
  socket.compress(false).emit('uncompressed', "that's rough");
});
```

#### socket.disconnect(close) **NOT IMPLEMENTED**

  - `close` _(Boolean)_ whether to close the underlying connection
  - **Returns** `Socket`

Disconnects this client. If value of close is `true`, closes the underlying connection. Otherwise, it just disconnects the namespace.

```js
io.on('connection', (socket) => {
  setTimeout(() => socket.disconnect(true), 5000);
});
```

#### Flag: 'broadcast' **NOT IMPLEMENTED**

Sets a modifier for a subsequent event emission that the event data will only be _broadcast_ to every sockets but the sender.

```js
io.on('connection', (socket) => {
  socket.broadcast.emit('an event', { some: 'data' }); // everyone gets it but the sender
});
```

#### Flag: 'volatile' **NOT IMPLEMENTED**

Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to receive messages (because of network slowness or other issues, or because they’re connected through long polling and is in the middle of a request-response cycle).

```js
io.on('connection', (socket) => {
  socket.volatile.emit('an event', { some: 'data' }); // the client may or may not receive it
});
```

#### Flag: 'binary' **NOT IMPLEMENTED**

Specifies whether there is binary data in the emitted data. Increases performance when specified. Can be `true` or `false`.

```js
var io = require('socket.io')();
io.on('connection', function(socket){
  socket.binary(false).emit('an event', { some: 'data' }); // The data to send has no binary data
});
```

#### Event: 'disconnect' **NOT IMPLEMENTED**

  - `reason` _(String)_ the reason of the disconnection (either client or server-side)

Fired upon disconnection.

```js
io.on('connection', (socket) => {
  socket.on('disconnect', (reason) => {
    // ...
  });
});
```

#### Event: 'error' **NOT IMPLEMENTED**

  - `error` _(Object)_ error object

Fired when an error occurs.

```js
io.on('connection', (socket) => {
  socket.on('error', (error) => {
    // ...
  });
});
```

#### Event: 'disconnecting' **NOT IMPLEMENTED**

  - `reason` _(String)_ the reason of the disconnection (either client or server-side)

Fired when the client is going to be disconnected (but hasn't yet).

```js
io.on('connection', (socket) => {
  socket.on('disconnecting', (reason) => {
    let rooms = Object.keys(socket.rooms);
    // ...
  });
});
```

These are reserved events (along with `connect`, `newListener` and `removeListener`) which cannot be used as event names.
