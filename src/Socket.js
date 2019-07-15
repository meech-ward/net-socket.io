const EventEmitter = require('events');
const util = require('util');

const JSONStream = require('json-stream');

/**
 * Blacklisted events.
 *
 * @api public
 */

const events = new Set([
  'disconnect',
  'disconnecting',
  'newListener',
  'removeListener',

  'close',
  'connect',
  'data',
  'drain',
  'end',
  'error',
  'lookup',
  'ready',
  'timeout',
]);

/**
 * Flags.
 *
 * @api private
 */

const flags = [
  'json',
  'volatile',
  'broadcast',
  'local'
];

/**
 * `EventEmitter#emit` reference.
 */

const emit = EventEmitter.prototype.emit;

module.exports = function(net, fs) {
  function Socket(p, host) {
    if (!new.target) {
      return new Socket(p, host);
    }
    EventEmitter.call(this);

    if (typeof p.on === 'function') {
      this.netSocket = p;
    } else {
      this.netSocket = net.createConnection(p, host);
    }

    this.netSocket.on('ready', () => this.emit('ready'));
    this.netSocket.on('error', error => this.emit('error', error));
    this.netSocket.on('close', error => this.emit('close', error));
    this.netSocket.on('data', this.handleIncomingRawData.bind(this));

    this._stream = JSONStream();
    this._stream.on('data', this.handleIncomingParsedData.bind(this));
  }
  Socket.prototype = Object.create(EventEmitter.prototype);

  Socket.prototype.handleIncomingRawData = function(data) {
    this._stream.write(data.toString());
  }
  Socket.prototype.handleIncomingParsedData = function(data) {
    emit.call(this, data.eventName, data.args);
  }

  Socket.prototype.emit = function(ev) {
    if (events.has(ev)) {
      emit.apply(this, arguments);
      return this;
    }

    let args = Array.from(arguments);
    
    // access last argument to see if it's an ACK callback
    if (typeof args[args.length - 1] === 'function') {
      
    }

    if (args.length === 1) {
      args = undefined
    } else {
       args = args.slice(1);
    }

    const packet = {
      eventName: ev,
      args: args
    };

    const data = JSON.stringify(packet);
  
    // Need the line break for the json parsing library
    this.netSocket.write(data+'\r\n');

    return this;
  };

  return Socket;
};