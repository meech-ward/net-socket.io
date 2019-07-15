# Net Socket IO

Heavily Based on [https://github.com/socketio/socket.io]

* This should inherit the same interface as socket.io
* Only for ipc sockets
* Actually could be for basic tcp sockets as well
* Just not HTTP WebSockets
* Creates a new TCP or IPC server.

## Examples

**server**

```js
const {Server} = require('ipc-socket-io');
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
const { Socket } = require('ipc-socket-io');
const socketFile = '/tmp/socket';
const socket = Socket(socketFile);

socket.emit('request', /* */);
socket.on('reply', function(data){ /* */ }); // listen to the event
```
