const EventEmitter = require('events');

function Server() {
  EventEmitter.call(this);
  this.listens = [];
  this.closeCallCount = 0;
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

module.exports = {
  createServerCallCount: 0,
  createServer() {
    this.createServerCallCount++;
    this.server = new Server();
    return this.server;
  },
  reset() {
    this.createServerCallCount = 0;
    this.server = new Server();
  }
}