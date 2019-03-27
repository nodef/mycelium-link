const EventEmitter = require('events');



function Server(options, connectionListener) {
  EventEmitter.call(this);
};
Server.prototype = new EventEmitter();



exports.Server = Server;
