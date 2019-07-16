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
  
  describe("emit", function() {
    it("should forward the emit function to all sockets", function(done) {
      const server = Server(1);
      let socketCount = 0;

      server.on('connection', socket => {
        socket.on('message', data => {
          assert(data === 'data')
          if(++socketCount === 4) {
            done();
          }
        });
        socket.on('anothermessage', (data, flag, number) => {
          assert(data.message === 'more data');
          assert(flag);
          assert.equal(number, 69)
          if(++socketCount === 4) {
            done();
          }
        });
        if (server.sockets.length == 2) {
          server.emit('message', 'data');
          server.emit('anothermessage', {message: 'more data'}, true, 69);
        }
      });
      server.on('listening', () => {
        mockNet.addClient();
        mockNet.addClient();
      });
    });
  });
});
