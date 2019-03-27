if(typeof WebSocket==='undefined') WebSocket = require('ws');
const EventEmitter = require('events');
const mypkt = require('./packet');
// NOTE: this can be provided here



function write(protocol, head, body) {
  var msg = mypkt.stringify(protocol, head, body);
  this.socket.send(msg);
};



function MyceliumLink(url, protocols) {
  EventEmitter.call(this);
  var ws = new WebSocket(url, protocols);
  ws.onerror = (event) => this.onerror? this.onerror(event):null;
  ws.onopen = (event) => this.onopen? this.onopen(event):null;
  ws.onclose = (event) => this.onclose? this.onclose(event):null;
  ws.onmessage = (event) => {
    var {head, body} = mypkt.parse(event.data);
    var {protocol} = head;
    if(protocol==='http') this.http(head, body);
    else console.error('message with unknown protocol:', protocol);
  };
  this.socket = ws;
  this.onerror = null;
  this.onhttp = null;
  this.onopen = null;
  this.onclose = null;
  this.onmessage = null;
};
MyceliumLink.prototype = new EventEmitter();
MyceliumLink.prototype.write = write;
