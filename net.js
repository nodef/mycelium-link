const EventEmitter = require('events');



function Server(options, connectionListener) {
  EventEmitter.call(this);
  // SEE: net.createServer()
  if(connectionListener) this.on('connection', connectionListener);
};
Server.prototype = new EventEmitter();



exports.Server = Server;
