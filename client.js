const HttpServerResp = require('./browser/httpserverresponse');
var res = HttpServerResp(null);


function messageParse(msg) {
  var len = parseInt(msg.substring(0, 8), 16);
  var head = JSON.parse(msg.substring(8, 8+len));
  var body = msg.substring(8+len);
  return {head, body};
};

function messageStringify(head, body) {
  var headStr = JSON.stringify(head);
  var lenStr = headStr.length.toString(16).padStart(8, '0');
  return lenStr+headStr+body;
};


function HttpServerResponse(id) {

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

var link = {};
var handlers = new Map();
var socket = new WebSocket('http://mycelium.com');
socket.onmessage = function(event) {
  var {head, body} = messageParse(event.data);
  if(head.type==='http.request') {
    handlers.set(head.id, head.request);
    link.onhttprequest(head.request, response={});
  }
  else if(head.type==='http.data') {
    req = handlers.get(head.id);
    req.ondata(body);
  }
  else if(head.type==='http.end') {
    req = handlers.get(head.id);
    req.onend();
  }
};
