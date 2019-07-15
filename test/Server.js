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
    it("should create a new tcp server", function() {
      const server = Server(80);
      assert.equal(mockNet.createServerCallCount, 1);
      assert.equal(mockNet.server.listens.length, 1);
      assert.equal(mockNet.server.listens[0], 80);
    });
  });
  it("should not try to remove any existing file at that path", function() {
    const server = Server(80);
    assert.equal(mockfs.unlinks.length, 0);
  });
  context("when initialized with a path", function() {
    it("should create a new ipc server", function() {
      const server = Server('path');
      assert.equal(mockNet.createServerCallCount, 1);
      assert.equal(mockNet.server.listens.length, 1);
      assert.equal(mockNet.server.listens[0], 'path');
    });
    it("should try to remove any existing file at that path", function() {
      const server = Server('path');
      assert.equal(mockfs.unlinks.length, 1);
      assert.equal(mockfs.unlinks[0], 'path');
    });
  });

  describe("#close", function() {
    it("should call close on the server", function() {
      const server = Server(80);
      server.close();
      assert.equal(mockNet.server.closeCallCount, 1);
    });
    context("when called on an ipc server", function() {
      it("should remove the socket file", function() {
        let server = Server('path');
        mockfs.reset();
        server.close();
        assert.equal(mockfs.unlinks.length, 1);
        assert.equal(mockfs.unlinks[0], 'path');

        mockfs.reset();

        server = Server(80);
        server.close();
        assert.equal(mockfs.unlinks.length, 0);
      });
    });
  });

  describe("#on('error'", function() {
    context("when there is an error from the net server", function() {
      it("should be emitted from the server", function() {
        let server = Server('path');
        let errorData;
        server.on('error', function(error) {
          errorData = error;
        });
        mockNet.server.emitError("err");
        assert.equal(errorData, "err");
      })
    })
  });
});