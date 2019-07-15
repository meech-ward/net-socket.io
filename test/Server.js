const assert = require('assert').strict;

const mockNet = require('./mocks/mockNet');
const mockfs = {};
const Server = require('../src/Server')(mockNet, mockfs);

describe("Server", function() {
  it("should initialize the same with or without new", function() {
    const server1 = Server(1);
    const server2 = new Server(1);
    assert.deepEqual(Object.getPrototypeOf(server1), Object.getPrototypeOf(server2));
  });
  context("when initialized with a port", function() {
    xit("should create a new tcp server", function() {
      const server = Server(3000);
      assert.equal(mockNet.createServerCallCount, 1);
      assert.equal(mockNet.server.listens.count, 1);
      assert.equal(mockNet.server.listens[0], 3000);
    });
  });
});