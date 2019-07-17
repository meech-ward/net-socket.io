const { Socket } = require('../../index');
const socket = Socket(3000, 'localhost');

socket.on('ready', () => {
  socket.emit('message', 'hello');
});