if(typeof WebSocket==='undefined') WebSocket = require('ws');
const EventEmitter = require('events');
const dgram = require('./dgram');



function write(protocol, head, body) {
  var msg = mypkt.stringify(protocol, head, body);
  this.socket.send(msg);
};



// NOTE: can first arg be called type?
function messageParse(msg) {
  var protocol = msg.substring(0, 4).trimEnd();
  var size = parseInt(msg.substring(4, 8), 16);
  var head = JSON.parse(msg.substring(8, 8+size));
  var body = msg.substring(8+size);
  return {protocol, head, body};
};

function messageStringify(protocol, head, body) {
  var bodyStr = body||'';
  var headStr = JSON.stringify(head);
  var sizeStr = headStr.length.toString(16).padStart(4, '0');
  var protocolStr = protocol.padEnd(4);
  return protocolStr+sizeStr+headStr+bodyStr;
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


class Socket extends EventEmitter {
  constructor(url, protocols) {
    super();
    var ws = new WebSocket(url, protocols);
    this.socket = ws;
    this.onerror = null;
    this.onclose = null;
    this.onopen = null;
    this.onmessage = null;
    this.dgram = dgram(this);
    this.on('error', (err) => this.onerror? this.onerror(err):null);
    this.on('close', () => this.onclose? this.onclose():null);
    this.on('open', () => this.onopen? this.onopen():null);
    this.on('message', (data) => this.onmessage? this.onmessage(data):null);
  }
  send(protocol, head, body, callback) {
    this.socket.send(messageStringify(protocol, head, body));
    if(callback) callback();
  }
}



exports.Socket = Socket;
// exports.Server = Server;
a = new Socket('wss://echo.websocket.org');
a.onopen = () => {
  var s = new a.dgram.Socket();
  s.send('x', 80, '1.1.1.1', () => console.log('sent'));
};
