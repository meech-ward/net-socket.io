const EventEmitter = require('events');
const util = require('util');

/**
 * Blacklisted events.
 */
const events = new Set([
  'disconnect',
  'disconnecting',
  'newListener',
  'removeListener',

  'close',
  'connection',
  'error',
  'listening',
]);

/**
 * `EventEmitter#emit` reference.
 */
const emit = EventEmitter.prototype.emit;

function setupServer(net, connectionListener, emit) {
  const server = net.createServer(connectionListener);
  server.on('error', error => emit('error', error));
  server.on('listening', () => emit('listening'));
  return server;
}

function unlink(fs, file) {
  const fsUnlink = util.promisify(fs.unlink.bind(fs));
  return fsUnlink(file);
}

module.exports = function(net, fs, Socket) {

  /**
   * Create a new IPC or TCP server.
   * @param {String, Number} p The port or path for the server.
   */
  function Server(p) {
    if (!new.target) {
      return new Server(p);
    }
    EventEmitter.call(this);

    this._p = p;
    this.sockets = [];
    
    (async () => {
      if (typeof this._p === "string") {
        try {
          await unlink(fs, this._p);
        } catch (err) {
          // do nothing
        }
      }
      this.netServer = await setupServer(net, this._connectionListener.bind(this), this.emit.bind(this));
      this.netServer.listen(p);
    })();
  }

  Server.prototype = Object.create(EventEmitter.prototype);

  /**
   * Close the server
   */
  Server.prototype.close = async function() {
    if (!this.netServer) {
      return;
    }
    this.netServer.close();
    if (typeof this._p === "string") {
      unlink(fs, this._p);
    }
  }


  /**
   * Call this function to emit to all connected clients.
   */
  Server.prototype.emit = function(ev) {
    if (events.has(ev)) {
      emit.apply(this, arguments);
      return this;
    }

    const args = arguments;
    this.sockets.forEach(socket => {
      socket.emit.apply(socket, args);
    });

    return this;
  };

  /**
   * Gets called when a new client connects. NEVER call this directly.
   */
  Server.prototype._connectionListener = function(client) {
    const socket = new Socket(client);
    this.sockets.push(socket);

    socket.on('close', () => {
      this.sockets = this.sockets.filter(s => s !== socket);
    });

    this.emit('connection', socket);
  }

  return Server;
};