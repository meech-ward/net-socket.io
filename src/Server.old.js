

const EventEmitter = require('events');

function unlinkFile(file) {
  try {
    fs.unlinkSync(file);
  } catch (e) {
    // console.log(e);
  }
}

function makeUnlinkFile(file) {
  return () => unlinkFile(file);
}

function sendMessage(client, message) {
  client.write(message+'\r\n', 'utf8', () => {
  });
}

function messageFrom(name, data) {
  return JSON.stringify({name, data});
}

function emitToAll(io, name, data) {
  const message = messageFrom(name, data);
  for (let socket of io.sockets) {
    sendMessage(socket, message);
  }
}
function makeEmitToAll(io) {
  return (name, data) => {
    emitToAll(io, name, data);
  }
}

function addNewSocket(io, s) {
  const socket = new EventEmitter();
  socket.socket = s;
  io.sockets.add(socket);
  s.setNoDelay(true);
  s.on('end', () => {
    io.sockets.delete(socket);
  });
  s.on('data', (data) => {
    // messageReceived(data.toString());
    // parse teh data
    // socket.emit(data.name, data.data)
  });
}

function startServer(messageReceived) {
  return new Promise((resolve, reject) => {

    const io = new EventEmitter();

    const unlinkSocketFile = makeUnlinkFile(socketFile);
    unlinkSocketFile();

    io.sockets = new Set();
    
    io.emit = makeEmitToAll(io);
    io.sockets.emit = makeEmitToAll(io);
  
    io.server = net.createServer(socket => {
      addNewSocket(io, socket);
    });

    io.server.on('error', (err) => {
      reject(err);
    });
    
    io.server.listen(socketFile, () => {
      resolve(io);
    });
  });
}

module.exports = startServer;