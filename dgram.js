const EventEmitter = require('events');


protocol://[host]:port/path
function addressParse(url) {
  var isIPv4 = url.includes('.');
  var family = isIPv4? 'IPv4':'IPv6';
  var hostname = url.replace(/.*?\/\//, '').replace(/\/.*/, '');
  var portStr = hostname.substring((hostname.lastIndexOf(':')+1)||hostname.length);
  var port = portStr.includes(']')||(hostname.includes(':') && 
  var port = /\[|\./.test(hostname)? parseInt(hostname.substring(hostname.lastIndexOf(':')+1)):0;
};

function Socket() {
  EventEmitter.call(this);
  this.emit('close');
  this.emit('error');
  this.emit('listening');
  this.emit('message');
};
Socket.prototype = new EventEmitter();
Socket.prototype.address = address;
Socket.prototype.bind = bind;
Socket.prototype.close = close;
Socket.prototype.send = send;



function toString(msg, start, end) {
  var start = start||0, end = end||msg.length;
  if(typeof msg==='string') return msg.substring(start, end);
  if(Array.isArray(msg)) return String.fromCharCode.apply(null, msg.slice(start, end));
  if(msg instanceof Uint8Array) return new TextDecoder('utf-8').decode(msg.subarray(start, end));
  return msg.toString(start, end);
};

function sendInternal(msg, port, address, callback) {
  var source = this.address(), target = {port, address};
  this.connection.send('dgram', {source, target}, msg, callback);
};



class Socket extends EventEmitter {
  constructor(options, callback) {
    super();
    var o = options||{};
    this.address = {family: o.type};
    if(callback) this.on('message', callback);
  }
  address() {
    return this.address;
  }
  close() {
    this.connection.unbind();
  }
  bind(options, callback) {
    this.connection.bind(options, callback);
  }
  send(msg, offset, length, port, address, callback) {
    if(arguments.length<=4) sendInternal.call(toString(msg), offset, length, port);
    else sendInternal.call(toString(msg, offset, offset+length), port, address, callback);
  }
}



function createSocket(type, callback) {
  var options = typeof type==='object'? type : {type};
  return new this.Socket(options, callback);
};

function handleMessage(head, body) {
  var {dgrams} = this.connection;
  var {source, target} = head;
  var socket = dgrams.get(target)||dgrams.get(null);
  socket.emit('message', body, {});
};


exports.Socket = Socket;
exports.createSocket = createSocket;
