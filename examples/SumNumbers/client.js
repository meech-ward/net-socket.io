const socket = require('../../index').Socket('/tmp/sum_numbers');

socket.on('result', result => {
  console.log(result);
});

socket.on('ready', () => {
  socket.emit('sum', [1,2,3,4,5,6]);
});
