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
