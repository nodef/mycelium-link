const EventEmitter = require('events');



function address() {
  // this.address?
  var {family, address} = this.connection.address();
  var port = 0||this.port;
  return {port, family, address};
};

function close(callback) {
  // NOTE: remove the port bound
  this.emit('close');
  if(callback) callback();
  return this;
};

function getConnections(callback) {
  var err = null, count = this.connections.length;
  if(callback) callback(err, count);
  return this;
};

function listen() {

};



function Server(options, connectionListener) {
  EventEmitter.call(this);
  // SEE: net.createServer()
  if(connectionListener) this.on('connection', connectionListener);
  // EVENTS:
  // - error
  // - close
  // - listening
  // - connection
  this.connections = []; // current connections to server
  this.listening = false;
  this.maxConnections = 0;
};
Server.prototype = new EventEmitter();
Server.prototype.address = address;
Server.prototype.close = close;
Server.prototype.getConnections = getConnections;
Server.prototype.listen = listen;




class Server extends EventEmitter {

}




function Socket(options) {
  EventEmitter.call(this);
  // on-close(hadError)
  // on-connect
  // on-data(data)
  // on-drain
  // on-end
  // on-error(err)
  // on-lookup(err, address, family, host)
  // on-ready
  // on-timeout
  this.bufferSize = 0;
  this.bytesRead = 0;
  this.connecting = false;
  this.destroyed = false;
  this.localAddress = '';
  this.localPort = 0;
  this.pending = false;
  this.remoteAddress = '';
  this.remoteFamily = 'IPv4';
  this.remotePort = 0;
};
Socket.prototype = new EventEmitter();
Socket.prototype.close = close;
Socket.prototype.address = address;
Socket.prototype.connect = connect;
Socket.prototype.destroy = destroy;
Socket.prototype.end = end;
Socket.prototype.pause = pause;
Socket.prototype.resume = resume;
Socket.prototype.setEncoding = setEncoding;
Socket.prototype.setKeepAlive = setKeepAlive;
Socket.prototype.setNoDelay = setNoDelay;
Socket.prototype.setTimeout = setTimeout;
Socket.prototype.write = write;



function connect() {

};

function createConnection() {

};

function createServer() {

};

function isIP() {

};

function isIPv4() {

};

function isIPv6() {

};



exports.Server = Server;
exports.Socket = Socket;
exports.connect = connect;
exports.createConnection = createConnection;
exports.createServer = createServer;
exports.isIP = isIP;
exports.isIPv4 = isIPv4;
exports.isIPv6 = isIPv6;
