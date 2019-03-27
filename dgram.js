const EventEmitter = require('events');



function Socket() {
  EventEmitter.call(this);
  this.emit('close');
  this.emit('error');
  this.emit('listening');
  this.emit('message');
};
Socket.prototype = new EventEmitter();
Socket.prototype.addMembership = addMembership;
Socket.prototype.address = address;
Socket.prototype.bind = bind;
Socket.prototype.close = close;
Socket.prototype.dropMembership = dropMembership;
Socket.prototype.getRecvBufferSize = getRecvBufferSize;
Socket.prototype.getSendBufferSize = getSendBufferSize;
Socket.prototype.ref = ref;
Socket.prototype.send = send;
Socket.prototype.setBroadcast = setBroadcast;
Socket.prototype.setMulticastInterface = setMulticastInterface;
Socket.prototype.setMulticastLoopback = setMulticastLoopback;
Socket.prototype.setMulticastTTL = setMulticastTTL;
Socket.prototype.setRecvBufferSize = setRecvBufferSize;
Socket.prototype.setSendBufferSize = setSendBufferSize;
Socket.prototype.setTTL = setTTL;
Socket.prototype.unref = unref;



function createSocket() {

};



exports.Socket = Socket;
exports.createSocket = createSocket;
