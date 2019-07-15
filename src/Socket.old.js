
 
var stream = JSONStream();

const socketFile = require('./socketFile');
const socket = net.connect(socketFile);


stream.on('data', (chunk) => {
  console.log(chunk);
});

socket.on('connect', () => {
  // Connected to server
  socket.setNoDelay(true);
  // Send some data to the server
  socket.write(process.argv[2]);
});

socket.on('data', (data) => {
  // Received data from the server
  // console.log(data.toString());
  stream.write(data.toString());
});

socket.on('close', (data) => {
  // Connection closed
});