const assert = require('assert').strict;

const EventEmitter = require('events');

const mockNet = require('./mocks/mockNet');
const mockfs = require('./mocks/mockfs');
const Socket = require('../src/Socket')(mockNet, mockfs);

describe("Socket", function() {
  beforeEach(function() {
    mockNet.reset();
    mockfs.reset();
  });
  describe("#emit", function() {
    it("should call write on the netSocket with the data stringified according to the protocol", function(done) {
      let emitCount = 0;
      function assertSocketEmit(name, args) {
        let netSocket = new EventEmitter();
        netSocket.write = function(json) {
          const object = JSON.parse(json);
          emitCount++;
          assert.equal(object.eventName, name);
          assert.deepEqual(object.args, args);
        }
        let socket = Socket(netSocket);

        if (args) {
          socket.emit.apply(socket, [name, ...args]);
        } else {
          socket.emit(name);
        }
        
      }
      
      assertSocketEmit('');
      assertSocketEmit('msg');
      assertSocketEmit('msg', [1]);
      assertSocketEmit('message', ["hello", ["hi"], 1, true, {name: "🤗"}]);
      assert.equal(emitCount, 4);
      done();
    });
  });

  describe("#on(data)", function() {
    context("when the net socket emits json data that conforms to the protocol", function() {
      it("should call on data with the json object", function(done) {
        
        let eventCount = 0;

        function assertPacketWasPassed(packet) {
          let netSocket = new EventEmitter();
          let socket = Socket(netSocket);
          socket.on(packet.eventName, data => {
            assert.deepEqual(packet.args, data);
            eventCount++;
            if (eventCount === 3) {
              done();
            }
          });
          netSocket.emit('data', JSON.stringify(packet)+'\r\n');
        }
        assertPacketWasPassed({
          "eventName": "event"
        });
        assertPacketWasPassed({
          "eventName": "event",
          "args": ["String"]
        });
        assertPacketWasPassed({
          "eventName": "event",
          "args": ["String", {key: 6}]
        });
      });
    });
  });
  
});