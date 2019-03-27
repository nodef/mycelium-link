const EventEmitter = require('events');


function Socket(url, protocols) {
  this.binaryType = '';
  this.bufferedAmount = 0;
  this.extensions = null;
  this.onclose = null;
  this.onerror = null;
  this.onmessage = null;
  this.onopen = null;
  this.protocol = null;
  this.readyState = null;
  this.url = null;
  this.emit('close');
  this.emit('error');
  this.emit('message');
  this.emit('open');
};
Socket.CONNECTING = 0;
Socket.OPEN = 1;
Socket.CLOSING = 2;
Socket.CLOSED = 3;
Socket.prototype.close = close(code, reason);
Socket.prototype.send = send(data);



function Server(options, callback) {
  EventEmitter.call(this);
  this.emit('close');
  this.emit('connection');
  this.emit('error');
  this.emit('headers');
  this.emit('listening');
};
Server.prototype.close = close(callback);
Server.prototype.handleUpgrade = handleUpgrade(request, socket, head, callback);
Server.prototype.shouldHandle = shouldHandle(request);



exports.WebSocket = Socket;
exports.WebSocket.Server = Server;
