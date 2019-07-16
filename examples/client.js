const {Socket} = require('../index.js');
const socketPath = '/tmp/socket'; // file for IPC socket, or port number for TCP socket.
const socket = Socket(socketPath);

socket.on('message', function(data) {
  console.log('message', data);
});
socket.on('broadcast', function(data) {
  console.log('broadcast', data);
});

socket.on('error', function(error) {
  console.log(error);
});

socket.on('ready', function() {
  console.log(`ready: ${socketPath}`);
  socket.emit('hello', true);
});