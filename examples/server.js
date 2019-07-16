const {Server} = require('../index.js');
const socketPath = '/tmp/socket'; // file for IPC socket, or port number for TCP socket.
const io = Server(socketPath);

io.on('connection', function(socket) {
  socket.emit('message', 'hello');

  io.emit('broadcast', {
    message: "just broadcasting",
    numberOfSockets: io.sockets.length
  }); 

  socket.on('hello', function(data){ 
    console.log(data);
  });

  socket.on('disconnect', function () {
    console.log('client disconnected');
    io.emit('user disconnected', io.sockets.length);
  });
});

io.on('error', function(error) {
  console.log(error);
});

io.on('listening', function() {
  console.log(`Listening on: ${socketPath}`);
})