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





function MyceliumLinkServer(options, callback) {
  WebSocket.Server.call(this, options, callback);
  this.on('connection', (ws) => {
    ws.on('message', (data) => onMessage.call(this, data));
    // emit some events here...
  });
};
MyceliumLinkServer.prototype = new WebSocket.Server();
