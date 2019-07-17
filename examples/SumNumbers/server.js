const io = require('../../index').Server('/tmp/sum_numbers');

function sumNumbers(numbers) {
  const result = numbers.reduce((n, a) => n+a);
  return result;
}

io.on('connection', socket => {
  socket.on('sum', numbers => {
    socket.emit('result', sumNumbers(numbers));
  });
});