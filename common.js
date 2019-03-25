const EventEmitter = require('events');
const myhttp = require('./http');
const mypkt = require('./packet');



function onHttpResponse(head, body) {
  var {id, type, details} = head;
  var stream = this.streams.get(id);
  var {request, response} = stream;
  if(type==='http+') {
    var {statusCode} = details;
    response = stream.response = new myhttp.IncomingMessage(this, details, id);
    request.emit('response', response);
    if(request.method==='CONNECT') request.emit('connect', response);
    if(statusCode===100) request.emit('continue', response);
    else if(statusCode===101) request.emit('upgrade', response);
    else if(statusCode>=100 && statusCode<200) request.emit('information', response);
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

function begin(id, request) {
  this.streams.set(id, {request});
  this.requests.add(id);
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
