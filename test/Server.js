const assert = require('assert').strict;

const mockNet = require('./mocks/mockNet');
const mockfs = require('./mocks/mockfs');
const Server = require('../src/Server')(mockNet, mockfs);

describe("Server", function() {
  beforeEach(function() {
    mockNet.reset();
    mockfs.reset();
  });
  it("should initialize the same with or without new", function() {
    const server1 = Server(1);
    const server2 = new Server(1);
    assert.deepEqual(Object.getPrototypeOf(server1), Object.getPrototypeOf(server2));
  });
  context("when initialized with a port", function() {
    it("should create a new tcp server", function(done) {
      const server = Server(80);
      server.on('listening', () => {
        assert.equal(mockNet.createServerCallCount, 1);
        assert.equal(mockNet.server.listens.length, 1);
        assert.equal(mockNet.server.listens[0], 80);
        done();
      });
    });
  });
  it("should not try to remove any existing file at that path", function() {
    const server = Server(80);
    assert.equal(mockfs.unlinks.length, 0);
  });
  context("when initialized with a path", function() {
    it("should create a new ipc server", function(done) {
      const server = Server('path');
      server.on('listening', () => {
        assert.equal(mockNet.createServerCallCount, 1);
        assert.equal(mockNet.server.listens.length, 1);
        assert.equal(mockNet.server.listens[0], 'path');
        done();
      });
    });
    it("should try to remove any existing file at that path", function(done) {
      const server = Server('path');
      server.on('listening', () => {
        assert.equal(mockfs.unlinks.length, 1);
        assert.equal(mockfs.unlinks[0], 'path');
        done();
      });
    });
  });

  describe("#close", function() {
    it("should call close on the server", function(done) {
      const server = Server(80);
      server.on('listening', () => {
        server.close();
        assert.equal(mockNet.server.closeCallCount, 1);
        done();
      });
    });
    it("should do nothing if listening hasn't been called yet", function() {
      const server = Server('path');
      server.close();
      assert.equal(mockNet.server.closeCallCount, 0);
    });
    context("when called on an ipc server", function() {
      it("should remove the socket file", function(done) {
        let server = Server('path');
        server.on('listening', () => {
          mockfs.reset();
          server.close();
          assert.equal(mockfs.unlinks.length, 1);
          assert.equal(mockfs.unlinks[0], 'path');
  
          mockfs.reset();
  
          server = Server(80);
          server.close();
          assert.equal(mockfs.unlinks.length, 0);
          done();
        });
      });
    });
  });

  describe("#on('listening')", function() {
    context("when the listening event is emitted from the net server", function() {
      it("should be emitted from the server", function(done) {
        let server = Server('path');
        let count = 0;
        server.on('listening', () => {
          count++;
          if (count < 5) {
            mockNet.server.emitListening();
          } else {
            assert(true);
            done();
          }
        });
      })
    })
  });

  describe("#on('error')", function() {
    context("when there is an error from the net server", function() {
      it("should be emitted from the server", function(done) {
        let server = Server('path');
        server.on('listening', () => {
          let errorData;
          server.on('error', function(error) {
            errorData = error;
          });
          mockNet.server.emitError("err");
          assert.equal(errorData, "err");
          done();
        });
      })
    })
  });
});