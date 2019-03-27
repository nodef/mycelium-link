const EventEmitter = require('events');
const {toString} = require('./util');



function sendInternal(msg, port, address, callback) {
  var source = this.address(), target = {port, address};
  this.connection.send('dgram', {source, target}, msg, callback);
};

function urlStringify(options) {
  var {address, port} = options||{};
  return address||port? `dgram://${address||''}:${port||'0'}`:'';
};

function urlParse(url) {
  if(!url) return {family: 'IP', address: '', port: 0, url};
  var o = new URL(url);
  var family = o.host.includes('.')? 'IPv4':'IPv6';
  var address = o.host, port = parseInt(o.port||'0');
  return {family, address, port, url};
};



class Socket extends EventEmitter {
  constructor(options, callback) {
    super();
    if(callback) this.on('message', callback);
  }
  address() {
    return urlParse(this.url);
  }
  close(callback) {
    var {dgrams} = this.connection;
    if(this.url!=null) dgrams.delete(this.url);
    this.url = null;
    if(callback) callback();
    this.emit('close');
  }
  bind(options, callback) {
    var {dgrams} = this.connection;
    var url = urlStringify(options);
    var err = dgrams.has(url)? `Can't bind to already bound address: ${url}`:null;
    if(err) return this.emit('error', new Error(err));
    dgrams.set(this.url = url, this);
    if(callback) callback();
    this.emit('listening');
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
  var socket = dgrams.get(target)||dgrams.get('');
  if(socket) return socket.emit('message', body, urlParse(source));
  var err = 'No matching dgram socket to handle message: '+JSON.stringify({head, body}, null, 2);
  this.connection.emit('error', new Error(err));
};



exports.Socket = Socket;
exports.createSocket = createSocket;
exports.handleMessage = handleMessage;
