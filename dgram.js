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
Socket.prototype.send = send;
Socket.prototype.setBroadcast = setBroadcast;
Socket.prototype.setMulticastInterface = setMulticastInterface;
Socket.prototype.setMulticastLoopback = setMulticastLoopback;
Socket.prototype.setMulticastTTL = setMulticastTTL;
Socket.prototype.setRecvBufferSize = setRecvBufferSize;
Socket.prototype.setSendBufferSize = setSendBufferSize;


class Socket extends EventEmitter {
  constructor(options, callback) {
    super();
    var o = options||{};
    this.type = o.type||'udp4';
    this.reuseAddr = o.reuseAddr||false;
    this.ipv6Only = o.ipv6Only||false;
    this.recvBufferSize = o.recvBufferSize||0;
    this.sendBufferSize = o.sendBufferSize||0;
    this.lookup = o.lookup||null;
    if(callback) this.on('message', callback);
  }

  setTTL() {}
  unref() {}
  ref() {}
}



function createSocket(type, callback) {
  var options = typeof type==='object'? type : {type};
  return new this.Socket(options, callback);
};



exports.Socket = Socket;
exports.createSocket = createSocket;
