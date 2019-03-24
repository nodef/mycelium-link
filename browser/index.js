const _http = require('./http');


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




function httpInternal(options, callback) {
  var details = httpDetails(options);
  var id = this.id+(this.sent++);

};

function http(url, options, callback) {

};

function MyceliumLink(url, protocols) {
  var ws = new WebSocket(url, protocols);
  ws.onerror = (event) => this.onerror? this.onerror(event):null;
  ws.onopen = (event) => this.onopen? this.onopen(event):null;
  ws.onclose = (event) => this.onclose? this.onclose(event):null;
  ws.onmessage = (event) => {
    var {head, body} = messageParse(event.data);
    if(head.type==='http+') {
      var {id, sequence} = head;
      var request = new HttpRequest(this, head.request);
      var response = new HttpResponse(this, id);
      // response sequence?
      this.connections.set(id, {sequence, request, response});
      if(this.onhttp) this.onhttp(request, response);
      if(body && request.ondata) request.ondata(body);
    }
    else if(head.type==='http-') {
      var {id, sequence} = head;
      var {request} = this.connections.get(id);
      if(body && request.ondata) request.ondata(body);
      if(request.onend) request.onend();
    }
    else if(head.type==='httpd') {
      var {id, sequence} = head;
      var {request} = this.connections.get(id);
      if(body && request.ondata) request.ondata(body);
    }
  };
  this.socket = ws;
  this.connections = new Map();
  this.onerror = null;
  this.onhttp = null;
  this.onopen = null;
  this.onclose = null;
  this.onmessage = null;
};



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
var response = new _http.ServerResponse(connection, {}, Math.random());
response.setHeader('Accept', 'nothing');
var accept = response.getHeader('accept');
console.log('accept:', accept);
// response.flushHeaders();
response.write('Hello from ServerResponse!');
response.end('Bye!');
