function addTrailers(headers) {
  Object.assign(this.trailers, headers);
};

function end(data, encoding, callback) {
  var n = arguments.length;
  if(n===3 || (n===2 && typeof encoding!=='function')) {
    this.write(data, encoding);
    return this.end(callback);
  }
  if(n===2 || (n===1 && typeof data!=='function')) {
    this.write(data);
    return this.end(encoding);
  }
  var type = this.type+'.end';
  var trailers = this.trailers;
  this.connection.write({type, trailers}, null, function() {
    if(callback) callback();
    if(this.onfinish) this.onfinish();
  });
};

function getHeader(name) {
  return this.headers[name.toLowerCase()];
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

function removeHeader(name) {
  this.headers[name.toLowerCase()] = null;
};

function setHeader(name, value) {
  this.headers[name.toLowerCase()] = value;
};

function write(chunk, encoding, callback) {
  var type = this.type+'.data';
  this.connection.write({type}, chunk, callback);
};

function writeContinue() {
  this.writeHead(100, 'Continue');
};

function writeHead(statusCode, statusMessage, headers) {
  var type = this.type+'.head';
  var httpVersion = '1.1';
  this.statusCode = statusCode;
  this.statusMessage = statusMessage;
  headers = Object.assign(this.headers, headers);
  this.connection.write({type, httpVersion, statusCode, statusMessage, headers});
};

function writeProcessing() {
  this.writeHead(102, 'Processing');
};


function HttpRequest() {
  this.onabort = null;
  this.onconnect = null;
  this.oncontinue = null;
  this.oninformation = null;
  this.onresponse = null;
  this.onsocket = null;
  this.ontimeout = null;
  this.onupgrade = null;

  this.onaborted = null;
  this.onclose = null;
  this.aborted = false;
  this.complete = false;
  this.finished = false;
  this.headers = {};
  this.httpVersion = '1.1';
  this.method = 'GET';
  this.socket = null;
  this.statusCode = 404;
  this.statusMessage = 'Not Found';
  this.trailers = {};
  this.maxHeadersCount = 2000;
  this.path = '/';
  this.url = '/';
};

function HttpResponse(connection) {
  this.onclose = null;
  this.onfinish = null;
  this.connection = connection;
  this.finished = false;
  this.headersSent = false;
  this.headers = {};
  this.sendDate = true;
  this.socket = connection.socket;
  this.statusCode = 404;
  this.statusMessage = 'Not Found';
  this.trailers = {};
};
HttpResponse.prototype.addTrailers = addTrailers;
HttpResponse.prototype.end = end;
HttpResponse.prototype.getHeader = getHeader;
HttpResponse.prototype.getHeaderNames = getHeaderNames;
HttpResponse.prototype.getHeaders = getHeaders;
HttpResponse.prototype.hasHeader = hasHeader;
HttpResponse.prototype.removeHeader = removeHeader;
HttpResponse.prototype.setHeader = setHeader;
HttpResponse.prototype.write = write;
HttpResponse.prototype.writeContinue = writeContinue;
HttpResponse.prototype.writeHead = writeHead;
HttpResponse.prototype.writeProcessing = writeProcessing;
exports.HttpRequest = HttpRequest;
exports.HttpResponse = HttpResponse;
