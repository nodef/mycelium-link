const EventEmitter = require('events');



function Server(options, connectionListener) {
  EventEmitter.call(this);
  // SEE: net.createServer()
  if(connectionListener) this.on('connection', connectionListener);
  // EVENTS:
  // - error
  // - close
  // - listening
  // - connection
};
Server.prototype = new EventEmitter();



exports.Server = Server;
