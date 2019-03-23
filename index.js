const WebSocket = require('ws');



function messageParse(msg) {
  var len = parseInt(msg.substring(0, 8), 16);
  var head = JSON.parse(msg.substring(8, 8+len));
  var body = msg.substring(8+len);
  return {head, body};
};

function messageStringify(head, body) {
  var headStr = JSON.stringify(head);
  var lenStr = headStr.length.toString(16);
  return lenStr+headStr+body;
};



function Link(address, options) {
  var o = options||{};
  var socket = new WebSocket(address, options);
};
