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



exports.Server = Server;
