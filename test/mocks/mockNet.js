const EventEmitter = require('events');

function Server(connectionListener = ()=>{}) {
  EventEmitter.call(this);
  this.listens = [];
  this.closeCallCount = 0;
  this.connectionListener = connectionListener;
}
Server.prototype = Object.create(EventEmitter.prototype);
Server.prototype.listen = function(p) {
  this.listens.push(p);
  this.emit('listening');
}
Server.prototype.close = function() {
  this.closeCallCount++;
}
Server.prototype.emitError = function(error) {
  this.emit('error', error);
}
Server.prototype.emitListening = function() {
  this.emit('listening');
}

function Socket(p, h) {
  EventEmitter.call(this);
  this._p = p;
  this._h = h;
}
Socket.prototype = Object.create(EventEmitter.prototype);

module.exports = {
  reset() {
    this.createServerCallCount = 0;
    this.createConnectionCallCount = 0;
    this.clients = [];
    this.server = new Server();
  },
  createServerCallCount: 0,
  createServer(connectionListener) {
    this.createServerCallCount++;
    this.server = new Server(connectionListener);
    return this.server;
  },
  clients: [],
  createConnectionCallCount: 0,
  createConnection(p, host) {
    this.createConnectionCallCount++;
    const socket = new Socket(p, host);
    this.clients.push(socket);
    setTimeout(() => {
      socket.emit('ready');
    }, 0);
    return socket;
  },
  emitSockets(event, data) {
    this.clients.forEach(socket => {
      socket.emit(event, data);
    })
  },
  addClient(cb = ()=>{}) {
    const client = new EventEmitter();
    client.write = ()=>{};
    cb(client);
    this.server.connectionListener(client);
    return client;
  }
}