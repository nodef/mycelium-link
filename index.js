const WebSocket = WebSocket||require('ws');
const EventEmitter = require('events');
const myhttp = require('./http');
const mypkt = require('./packet');



function onHttpResponse(head, body) {
  var {id, type, details} = head;
  var stream = this.streams.get(id);
  var {request, response} = stream;
  if(type==='http+') {
    response = stream.response = new myhttp.IncomingMessage(this, details, id);
    request.emit('response', response);
  }
  if(body) response.emit('data', body);
  if(type==='http-') {
    this.requests.delete(id);
    this.streams.delete(id);
    response.emit('end');
  }
};

function onHttpRequest(head, body) {
  var {id, type, details} = head;
  if(!this.streams.has(id)) {
    var request = new myhttp.IncomingMessage(this, details, id);
    var response = new myhttp.ServerResponse(this, details, id);
    this.streams.set(id, {request, response});
    this.emit('http', request, response);
  }
  else {
    var {request, response} = this.streams.get(id);
  }
  if(body) request.emit('data', body);
  if(type==='http-') request.emit('end');
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
    var {head, body} = mypkt.parse(event.data);
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



/* TEST */
function write(head, body, callback) {
  var message = mypkt.stringify(head, body);
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
