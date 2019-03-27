const EventEmitter = require('events');



// reference: https://github.com/substack/http-browserify/blob/master/index.js
const STATUS_CODES = {
  100 : 'Continue',
  101 : 'Switching Protocols',
  102 : 'Processing',                 // RFC 2518, obsoleted by RFC 4918
  200 : 'OK',
  201 : 'Created',
  202 : 'Accepted',
  203 : 'Non-Authoritative Information',
  204 : 'No Content',
  205 : 'Reset Content',
  206 : 'Partial Content',
  207 : 'Multi-Status',               // RFC 4918
  300 : 'Multiple Choices',
  301 : 'Moved Permanently',
  302 : 'Moved Temporarily',
  303 : 'See Other',
  304 : 'Not Modified',
  305 : 'Use Proxy',
  307 : 'Temporary Redirect',
  400 : 'Bad Request',
  401 : 'Unauthorized',
  402 : 'Payment Required',
  403 : 'Forbidden',
  404 : 'Not Found',
  405 : 'Method Not Allowed',
  406 : 'Not Acceptable',
  407 : 'Proxy Authentication Required',
  408 : 'Request Time-out',
  409 : 'Conflict',
  410 : 'Gone',
  411 : 'Length Required',
  412 : 'Precondition Failed',
  413 : 'Request Entity Too Large',
  414 : 'Request-URI Too Large',
  415 : 'Unsupported Media Type',
  416 : 'Requested Range Not Satisfiable',
  417 : 'Expectation Failed',
  418 : 'I\'m a teapot',              // RFC 2324
  422 : 'Unprocessable Entity',       // RFC 4918
  423 : 'Locked',                     // RFC 4918
  424 : 'Failed Dependency',          // RFC 4918
  425 : 'Unordered Collection',       // RFC 4918
  426 : 'Upgrade Required',           // RFC 2817
  428 : 'Precondition Required',      // RFC 6585
  429 : 'Too Many Requests',          // RFC 6585
  431 : 'Request Header Fields Too Large',// RFC 6585
  500 : 'Internal Server Error',
  501 : 'Not Implemented',
  502 : 'Bad Gateway',
  503 : 'Service Unavailable',
  504 : 'Gateway Time-out',
  505 : 'HTTP Version Not Supported',
  506 : 'Variant Also Negotiates',    // RFC 2295
  507 : 'Insufficient Storage',       // RFC 4918
  509 : 'Bandwidth Limit Exceeded',
  510 : 'Not Extended',               // RFC 2774
  511 : 'Network Authentication Required' // RFC 6585
};



function requestDetails(options) {
  var o = options||{};
  var method = o.method||'GET';
  var path = o.path||'/';
  var httpVersion = o.httpVersion||'1.1';
  var headers = o.headers||{};
  headers['host'] = (o.hostname||o.host||'localhost')+(o.port? ':'+o.port:'');
  if(o.auth) headers['authorization'] = 'Basic '+btoa(o.auth);
  return {method, path, httpVersion, headers};
};

function responseDetails(options) {
  var o = options||{};
  var httpVersion = o.httpVersion||'1.1';
  var statusCode = o.statusCode||404;
  var statusMessage = o.statusMessage||STATUS_CODES[statusCode];
  var headers = o.headers||{};
  return {httpVersion, statusCode, statusMessage, headers};
};

function incomingDetails(options) {
  var o = options||{};
  var httpVersion = o.httpVersion||'1.1';
  var method = o.method||null;
  var statusCode = o.statusCode||0;
  var statusMessage = statusCode? o.statusMessage||STATUS_CODES[statusCode] : null;
  var path = o.path||'/';
  var headers = o.headers||{};
  return {httpVersion, method, statusCode, statusMessage, path, headers};
};



function abort() {
  this.aborted = true;
  this.emit('abort');
};

function writeInternal(head, body, callback) {
  if(this.aborted || this.finished) return false;
  if(this.sendDate) this.headers['date'] = (new Date()).toUTCString();
  this.connection.write(head, body, callback);
  return this.headersSent = true;
};

function write(chunk, encoding, callback) {
  var {id, details} = this;
  var head = this.headersSent? {id, type: 'httpd'}:{id, type: 'http+', details};
  return writeInternal.call(this, head, chunk, callback);
};

function writeHead(statusCode, statusMessage, headers) {
  this.statusCode = statusCode;
  this.statusMessage = statusMessage||STATUS_CODES[statusCode];
  Object.assign(this.headers, headers);
};

function writeContinue() {
  this.writeHead(100);
};

function writeProcessing() {
  this.writeHead(102);
};

function flushHeaders() {
  if(!this.headersSent) return this.write();
};

function endInternal(body, callback) {
  var {id, details, trailers} = this;
  if(!this.headersSent) writeInternal.call(this, {id, type: 'http+', details});
  writeInternal.call(this, {id, type: 'http-', details: {trailers}}, body, callback);
  this.connection.end(id); this.finished = true; this.emit('finish');
  return this;
};

function end(data, encoding, callback) {
  var n = arguments.length;
  if(n===3 || (n===2 && typeof encoding!=='function')) return endInternal.call(this, data, callback);
  if(n===2 || (n===1 && typeof data!=='function')) return endInternal.call(this, data, encoding);
  return endInternal.call(this, data);
};

function getHeader(name) {
  return this.headers[name.toLowerCase()];
};

function removeHeader(name) {
  this.headers[name.toLowerCase()] = null;
};

function setHeader(name, value) {
  this.headers[name.toLowerCase()] = value;
};

function getHeaderNames() {
  return Object.keys(this.headers);
};

function getHeaders() {
  return this.headers;
};

function hasHeader(name) {
  return this.headers[name.toLowerCase()] != null;
};

function addTrailers(headers) {
  Object.assign(this.trailers, headers);
};



function ClientRequest(connection, options, id) {
  EventEmitter.call(this);
  var details = requestDetails(options);
  var {method, path, httpVersion, headers} = details;
  this.aborted = false;
  this.finished = false;
  this.maxHeadersCount = 2000;
  this.connection = connection;
  this.socket = connection.socket;
  this.details = details;
  this.method = method;
  this.path = path;
  this.httpVersion = httpVersion;
  this.headers = headers;
  this.trailers = {};
  this.headersSent = false;
  this.id = id;
};
ClientRequest.prototype = new EventEmitter();
ClientRequest.prototype.abort = abort;
ClientRequest.prototype.end = end;
ClientRequest.prototype.flushHeaders = flushHeaders;
ClientRequest.prototype.getHeader = getHeader;
ClientRequest.prototype.removeHeader = removeHeader;
ClientRequest.prototype.setHeader = setHeader;
ClientRequest.prototype.write = write;



function ServerResponse(connection, options, id) {
  EventEmitter.call(this);
  connection.on('close', () => this.emit('close'));
  var details = responseDetails(options);
  var {httpVersion, statusCode, statusMessage, headers} = details;
  this.finished = false;
  this.headersSent = false;
  this.sendDate = true;
  this.connection = connection;
  this.socket = connection.socket;
  this.details = details;
  this.httpVersion = httpVersion;
  this.statusCode = statusCode;
  this.statusMessage = statusMessage;
  this.headers = headers;
  this.trailers = {};
  this.id = id;
};
ServerResponse.prototype = new EventEmitter();
ServerResponse.prototype.addTrailers = addTrailers;
ServerResponse.prototype.end = end;
ServerResponse.prototype.getHeader = getHeader;
ServerResponse.prototype.getHeaderNames = getHeaderNames;
ServerResponse.prototype.getHeaders = getHeaders;
ServerResponse.prototype.hasHeader = hasHeader;
ServerResponse.prototype.removeHeader = removeHeader;
ServerResponse.prototype.setHeader = setHeader;
ServerResponse.prototype.write = write;
ServerResponse.prototype.writeContinue = writeContinue;
ServerResponse.prototype.writeHead = writeHead;
ServerResponse.prototype.writeProcessing = writeProcessing;



function IncomingMessage(connection, options, id) {
  var details = incomingDetails(options);
  connection.on('close', () => this.emit('close'));
  var {httpVersion, method, statusCode, statusMessage, path, headers} = details;
  // this.onaborted = null; do what?
  this.aborted = false;
  this.complete = false; // NOTE: on end
  this.connection = connection;
  this.socket = connection.socket;
  this.details = details;
  this.httpVersion = httpVersion;
  this.method = method;
  this.statusCode = statusCode;
  this.statusMessage = statusMessage;
  this.path = path;
  this.url = path;
  this.headers = headers;
  this.trailers = {};
  this.id = id;
};



function requestInternal(connection, options, callback) {
  var id = Math.random(), request = new ClientRequest(connection, options, id);
  if(callback) request.on('response', callback);
  connection.begin(id, request);
  return request;
};

function request(connection, url, options, callback) {
  if(typeof url!=='string') return requestInternal(connection, url, options);
  var a = document.createElement('a');
  a.href = url;
  var {protocol, host, port} = a;
  var path = a.pathname+a.search+a.hash;
  options = Object.assign({protocol, host, port, path}, options);
  return requestInternal(connection, options, callback);
};

function get(connection, url, options, callback) {
  return request(connection, url, options, callback).end();
};
// createServer() : simulate a http server
// onhttp now handles all requests

exports.ClientRequest = ClientRequest;
exports.ServerResponse = ServerResponse;
exports.IncomingMessage = IncomingMessage;
exports.request = request;
exports.get = get;
