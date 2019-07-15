const assert = require('assert').strict;

const mockNet = require('./mocks/mockNet');
const mockfs = require('./mocks/mockfs');
const Socket = require('../src/Socket')(mockNet, mockfs);

describe("Socket", function() {
  beforeEach(function() {
    mockNet.reset();
    mockfs.reset();
  });
  it("should initialize the same with or without new", function() {
    const s1 = Socket(1);
    const s2 = new Socket(1);
    assert.deepEqual(Object.getPrototypeOf(s1), Object.getPrototypeOf(s2));
  });
  context("when initialized with a port", function() {
    it("should create a new tcp client", function(done) {
      const socket = Socket(80);
      socket.on('ready', () => {
        assert.equal(mockNet.createConnectionCallCount, 1);
        assert.equal(mockNet.clients.length, 1);
        assert.equal(mockNet.clients[0]._p, 80);
        done();
      });
    });
    context("and a host", function() {
      it("should create a new tcp client", function(done) {
        const socket = Socket(80, 'localhost');
        socket.on('ready', () => {
          assert.equal(mockNet.clients[0]._p, 80);
          assert.equal(mockNet.clients[0]._h, 'localhost');
          done();
        });
      });
    });
  });
  context("when initialized with a path", function() {
    it("should create a new ipc client", function(done) {
      const socket = Socket('path');
      socket.on('ready', () => {
        assert.equal(mockNet.createConnectionCallCount, 1);
        assert.equal(mockNet.clients.length, 1);
        assert.equal(mockNet.clients[0]._p, 'path');
        done();
      });
    });
  });

  describe("#on('ready')", function() {
    context("when the connect event is emitted from the net socket", function() {
      it("should be emitted from the socket", function(done) {
        let socket = Socket('path');
        let count = 0;
        socket.on('ready', () => {
          count++;
          if (count < 5) {
            mockNet.emitSockets('ready');
          } else {
            assert(true);
            done();
          }
        });
      })
    })
  });

  describe("#on('error')", function() {
    context("when there is an error from the net socket", function() {
      it("should be emitted from the socket", function(done) {
        let socket = Socket('socket');
        socket.on('ready', () => {
          let errorData;
          socket.on('error', function(error) {
            errorData = error;
          });
          mockNet.emitSockets('error', "err");
          assert.equal(errorData, "err");
          done();
        });
      })
    })
  });
});