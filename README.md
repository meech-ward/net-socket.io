# Net Socket IO

Net-Socket.IO enables real-time, bidirectional and event-based communication for low-level IPC and TCP sockets. It is a small wrapper around node's [`net`](https://nodejs.org/api/events.html) library, that makes low-level socket programming easy.

Heavily Based on [https://github.com/socketio/socket.io] and [Event Emitters](https://nodejs.org/api/events.html).

For more information on the motivation behind this library, check out my [blog post](https://sammeechward.com/net-socket-io/) on the subject.

## Examples

**server**

```js
const { Server } = require('net-socket.io');
const socketFile = '/tmp/socket'; // file for IPC socket, or port number for TCP socket.
const io = Server(socketFile);

io.on('connection', function(socket){
  socket.emit('request', /* */); // emit an event to the socket
  io.emit('broadcast', /* */); // emit an event to all connected sockets
  socket.on('reply', function(data){ /* */ }); // listen to the event
});
```

**client**

```js
const { Socket } = require('net-socket.io');
const socketFile = '/tmp/socket';
const socket = Socket(socketFile);

socket.on('ready', () => {
  socket.emit('request', /* */);
  socket.on('reply', (data) => { /* */ }); // listen to the event
});
```

Look in the [examples](https://github.com/meech-ward/net-socket.io/tree/master/examples) folder for complete examples.

## Documentation

Check out the [API documentation](https://github.com/meech-ward/net-socket.io/blob/master/docs/API.md) for more details.
