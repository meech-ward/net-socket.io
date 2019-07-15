module.exports = function(net, fs) {

  function Server() {
    if (!new.target) {
      return new Server(arguments);
    }
  }

  return Server;
};