const { Server } = require('../../index');
const io = Server(3000);

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    console.log('socket sent a message', data);
  })
});