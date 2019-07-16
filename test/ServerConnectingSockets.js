const assert = require('assert').strict;

const mockNet = require('./mocks/mockNet');
const mockfs = require('./mocks/mockfs');
const Socket = require('../src/Socket')(mockNet, mockfs);
const Server = require('../src/Server')(mockNet, mockfs, Socket);

describe("Server", function() {
  beforeEach(function() {
    mockNet.reset();
    mockfs.reset();
  });
  context("when a new client is connected", function() {
    it('it should be added to the list of sockets', function(done) {
      const server = Server(1);
      server.on('listening', () => {
        mockNet.addClient();
        assert.equal(server.sockets.length, 1);
        mockNet.addClient();
        assert.equal(server.sockets.length, 2);
        done();
      });
    });
    it('it should be a socket representation of the client', function(done) {
      const server = Server(1);
      server.on('listening', () => {
        const netSocket = mockNet.addClient();
        assert.equal(server.sockets[0].netSocket, netSocket);
        done();
      });
    });
    describe("#on('connection')", function() {
      it("should get called with the newly connected socket", function(done) {
        const server = Server(1);
        let netSocket;
        server.on('connection', socket => {
          assert.equal(server.sockets[0].netSocket, netSocket);
          assert.equal(socket.netSocket, netSocket);
          done();
        });
        server.on('listening', () => {
          mockNet.addClient((s) => netSocket = s);
        });
      });
    });
  });

  context("when a client disconnects", function() {
    it('should be removed from the sockets list', function(done) {
      const server = Server(1);
      let socketCount = 0;

      server.on('connection', socket => {
        socket.on('close', function() {
          assert.equal(server.sockets.length, 1);
          done();
        });
        if (server.sockets.length == 2) {
          socket.close();
        }
      });
      server.on('listening', () => {
        mockNet.addClient();
        mockNet.addClient();
      });
    });
  })
  
  describe("emit", function() {
    it("should forward the emit function to all sockets", function(done) {
      const server = Server(1);
      let socketCount = 0;

      server.on('connection', socket => {
        if (server.sockets.length == 2) {
          server.sockets.forEach(socket => assert(!socket.netSocket.args));
          server.emit('message', 'data');
          server.sockets.forEach(socket => {
            assert(JSON.parse(socket.netSocket.args).eventName === 'message');
          });
          server.emit('another message', {message: 'more data'}, true, 69);
          assert(JSON.parse(socket.netSocket.args).eventName === 'another message');
          done();
        }
      });
      server.on('listening', () => {
        mockNet.addClient();
        mockNet.addClient();
      });
    });
  });
});
