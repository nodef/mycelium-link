const EventEmitter = require('events');



function address() {
  // this.address?
  var {family, address} = this.connection.address();
  var port = 0||this.port;
  return {port, family, address};
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
};
Server.prototype = new EventEmitter();



exports.Server = Server;
