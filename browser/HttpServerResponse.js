function addTrailers(headers) {
  Object.assign(this.trailers, headers);
};

function end(data, encoding, callback) {
  var args = Array.from(arguments);
  var argl = args[args.length-1];
  callback = typeof argl==='function'? argl:null;
  if(callback) args[args.length-1] = null;
  this.write.apply(this, args);
  this.end(callback);
  callback = typeof args[args.length-1]==='function'? 
  if(typeof args[args.length-1]==='function') 
  if (n===3 || (n===2 && typeof encoding!=='function')) {
    this.write(data, encoding);
    return this.end(callback);
  }
  if(n===2 && typeof encoding!=='function') {
    this.write(data, encoding);
    return 
  }
  if(n===0 || typeof data==='function') {
    // somehow write to connection here
    return;
  }
  if(n===1) { this.write(data); this.end(); }
  else if(n===2) {
    if(typeof encoding==='function') { this.write(data); this.end(encoding); }
    else { this.write(data, encoding); this.end(); }
  }
  else { this.write(data, encoding); this.end(callback); }
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
