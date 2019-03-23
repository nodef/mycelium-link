function destroy(error) {

};



function abort() {

};

function end(data, encoding, callback) {

};

function flushHeaders() {

};

function getHeader(name) {

};

function removeHeader(name) {

};

function setHeader(name, value) {

};

function setNoDelay(noDelay) {

};

function setSocketKeepAlive(enable, initialDelay) {

};

function setTimeout(msecs, callback) {

};

function write(chunk, encoding, callback) {
  
};




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
  // somehow write to connection here
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

function setTimeout(msecs, callback) {

};

function write(chunk, encoding, callback) {
  // somehow write to connection here
};

function writeContinue() {
  this.writeHead(100, 'Continue');
};

function writeHead(statusCode, statusMessage, headers) {
  this.statusCode = statusCode;
  this.statusMessage = statusMessage;
  Object.assign(this.headers, headers);
  // somehow write to connection here
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

function HttpSeverResponse(connection) {
  this.onclose = null;
  this.onfinish = null;
  this.connection = connection;
  this.finished = false;
  this.headersSent = false;
  this.sendDate = true;
  this.socket = null;
  this.statusCode = 404;
  this.statusMessage = 'Not Found';
  this.trailers = {};
  this.headers = {};
};
HttpSeverResponse.prototype.addTrailers = addTrailers;
module.exports = HttpSeverResponse;
