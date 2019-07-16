const net = require('net');
const fs = require('fs');

const Socket = require('./src/Socket')(net);
const Server = require('./src/Server')(net, fs, Socket);


module.exports = {
  Server, Socket
};

