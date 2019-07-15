const EventEmitter = require('events');

function setupServer(net, p, err) {
  const server = net.createServer();
  server.on('error', err);
  server.listen(p);
  return server;
}

function unlinkFile(fs, file) {
  try {
    fs.unlinkSync(file);
  } catch (e) {
    // console.log(e);
  }
}

module.exports = function(net, fs) {

  function Server(p) {
    if (!new.target) {
      return new Server(p);
    }
    EventEmitter.call(this);

    this._p = p;
    if (typeof this._p === "string") {
      unlinkFile(fs, this._p);
    }

    this.netServer = setupServer(net, p, error => this.emit('error', error));
  }

  Server.prototype = Object.create(EventEmitter.prototype);

  Server.prototype.close = function() {
    this.netServer.close();
    if (typeof this._p === "string") {
      unlinkFile(fs, this._p);
    }
  }

  return Server;
};