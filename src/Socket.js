const EventEmitter = require('events');
const util = require('util');

module.exports = function(net, fs) {
  function Socket(p, host) {
    if (!new.target) {
      return new Socket(p, host);
    }
    EventEmitter.call(this);

    this.netSocket = net.createConnection(p, host);
    this.netSocket.on('ready', () => this.emit('ready'));
    this.netSocket.on('error', error => this.emit('error', error));
    this.netSocket.on('close', error => this.emit('close', error));
  }
  Socket.prototype = Object.create(EventEmitter.prototype);

  return Socket;
};