const EventEmitter = require('events');
const myhttp = require('./http');



function messageParse(msg) {
  var len = parseInt(msg.substring(0, 8), 16);
  var head = JSON.parse(msg.substring(8, 8+len));
  var body = msg.substring(8+len);
  return {head, body};
};

function messageStringify(head, body) {
  var headStr = JSON.stringify(head);
  var lenStr = headStr.length.toString(16).padStart(8, '0');
  return lenStr+headStr+(body||'');
};


function onHttpResponse(head, body) {
  var {id, type, details} = head;
  var stream = this.streams.get(id);
  var {request, response} = stream;
  if(type==='http+') {
    response = stream.response = new myhttp.IncomingMessage(this, details, id);
    if(request.onresponse) request.onresponse(response);
  }
  if(body && response.ondata) response.ondata(body);
  if(type==='http-') {
    if(response.onend) response.onend();
    this.requests.delete(id);
    this.streams.delete(id);
  }
};

function onHttpRequest(head, body) {
  var {id, type, details} = head;
  if(!this.streams.has(id)) {
    var request = new myhttp.IncomingMessage(this, details, id);
    var response = new myhttp.ServerResponse(this, details, id);
    this.streams.set(id, {request, response});
    if(this.onhttp) this.onhttp(request, response);
  }
  else {
    var {request, response} = this.streams.get(id);
  }
  if(body && request.ondata) request.ondata(body);
  if(type==='http-' && request.onend) request.onend();
};

function onHttp(head, body) {
  var {id} = head;
  if(this.requests.has(id)) onHttpResponse.call(this, head, body);
  else onHttpRequest.call(this, head, body);
};

function end(id) {
  if(this.requests.has(id)) return;
  this.streams.delete(id);
};

function http(url, options, callback) {
  var request = myhttp.request(url, options, callback);
  this.requests.add(request.id);
  return request;
};

function MyceliumLink(url, protocols) {
  var ws = new WebSocket(url, protocols);
  var streams = new Map();
  ws.onerror = (event) => this.onerror? this.onerror(event):null;
  ws.onopen = (event) => this.onopen? this.onopen(event):null;
  ws.onclose = (event) => this.onclose? this.onclose(event):null;
  ws.onmessage = (event) => {
    var {head, body} = messageParse(event.data);
    var {type} = head;
    if(/^http/.test(type)) onHttp.call(this, head, body);
  };
  this.socket = ws;
  this.streams = streams;
  this.onerror = null;
  this.onhttp = null;
  this.onopen = null;
  this.onclose = null;
  this.onmessage = null;
};
MyceliumLink.prototype.end = end;
MyceliumLink.prototype.http = http;



function write(head, body, callback) {
  var message = messageStringify(head, body);
  console.log('write:', message);
  if(callback) callback();
};

function BadConnection() {
  this.socket = null;
};
BadConnection.prototype.write = write;

var connection = new BadConnection();
var response = new myhttp.ServerResponse(connection, {}, Math.random());
response.setHeader('Accept', 'nothing');
var accept = response.getHeader('accept');
console.log('accept:', accept);
// response.flushHeaders();
response.write('Hello from ServerResponse!');
response.end('Bye!');
