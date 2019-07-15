function Server() {
  this.listens = [];
  this.closeCallCount = 0;
}
Server.prototype.listen = function(p) {
  this.listens.push(p);
}
Server.prototype.close = function() {
  this.closeCallCount++;
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
    this.server = null;
  }
}