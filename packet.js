function parse(msg) {
  var protocol = msg.substring(0, 4).trimEnd();
  var size = parseInt(msg.substring(4, 8), 16);
  var head = JSON.parse(msg.substring(8, 8+size));
  var body = msg.substring(8+size);
  return {protocol, head, body};
};

function stringify(protocol, head, body) {
  var bodyStr = body||'';
  var headStr = JSON.stringify(head);
  var sizeStr = headStr.length.toString(16).padStart(4, '0');
  var protocolStr = protocol.padEnd(4);
  return protocolStr+sizeStr+headStr+bodyStr;
};



exports.parse = parse;
exports.stringify = stringify;
