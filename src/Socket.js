const EventEmitter = require('events');

const JSONStream = require('json-stream');

/**
 * Blacklisted events.
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

module.exports = function(net) {

  /**
   * Represents a connected client.
   * The server will create one of these for each client when using the server interface.
   * Create one of these manually to connect to a server as a client
   * @param {String, Number} p The path or port of the server.
   * @param {String} host The host name of the server, only applies to TCP servers.
   */
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
    this.netSocket.on('close', () => this.emit('close'));
    this.netSocket.on('data', this._handleIncomingRawData.bind(this));

    this._stream = JSONStream();
    this._stream.on('data', this._handleIncomingParsedData.bind(this));
  }
  Socket.prototype = Object.create(EventEmitter.prototype);

  /**
   * Closes the socket. Sends a FIN packet.
   */
  Socket.prototype.close = function() {
    this.netSocket.close();
  }

  /**
   * Emit data to the server or client.
   */
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

  /**
   * Handles incoming socket data. NEVER call this directly
   */
  Socket.prototype._handleIncomingRawData = function(data) {
    this._stream.write(data.toString());
  }

  /**
   * Handles incoming parsed json data. NEVER call this directly
   */
  Socket.prototype._handleIncomingParsedData = function(data) {
    const args = data.args || [];
    emit.apply(this, [data.eventName, ...args]);
  }
  

  return Socket;
};