const WebSocket = require('ws');


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



function Link(address, options) {
  var o = options||{};
  var socket = new WebSocket(address, options);
  // headers
  // httpVersion
  // method
  // rawHeaders
  // rawTrailers
  // statusCode
  // statusMessage
  // trailers
  // url
  // 
};


var msg1 = messageStringify({type: 'http.post', source: '127.0.0.1:64123', target: '?'}, 'Hey!');
console.log('msg1:', msg1);
var {head, body} = messageParse(msg1);
console.log('head:', head);
console.log('body:', body);
