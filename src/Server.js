const EventEmitter = require('events');
const util = require('util');

function setupServer(net, p, emit) {
  const server = net.createServer();
  server.on('error', error => emit('error', error));
  server.on('listening', () => emit('listening'));
  return server;
}

function unlink(fs, file) {
  const fsUnlink = util.promisify(fs.unlink.bind(fs));
  return fsUnlink(file);
}

module.exports = function(net, fs) {

  function Server(p) {
    if (!new.target) {
      return new Server(p);
    }
    EventEmitter.call(this);

    this._p = p;
    
    (async () => {
      if (typeof this._p === "string") {
        await unlink(fs, this._p);
      }
      this.netServer = await setupServer(net, p, this.emit.bind(this));
      this.netServer.listen(p);
    })();
  }

  Server.prototype = Object.create(EventEmitter.prototype);

  Server.prototype.close = async function() {
    if (!this.netServer) {
      return;
    }
    this.netServer.close();
    if (typeof this._p === "string") {
      unlink(fs, this._p);
    }
  }

  return Server;
};