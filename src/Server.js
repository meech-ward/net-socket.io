
function setupServer(net, p) {
  const server = net.createServer();
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

    this._p = p;
    if (typeof this._p === "string") {
      unlinkFile(fs, this._p);
    }

    this.netServer = setupServer(net, p);
  }

  Server.prototype.close = function() {
    this.netServer.close();
    if (typeof this._p === "string") {
      unlinkFile(fs, this._p);
    }
  }

  return Server;
};