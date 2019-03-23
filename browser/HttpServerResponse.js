function addTrailers(headers) {
  Object.assign(this.trailers, headers);
};

function end(data, encoding, callback) {

};

function getHeader(name) {

};

function getHeaderNames() {

};

function getHeaders() {

};

function hasHeader(name) {

};

function removeHeader(name) {

};

function setHeader(name, value) {

};

function setTimeout(msecs, callback) {

};

function write(chunk, encoding, callback) {

};

function writeContinue() {

};

function writeHead(statusCode, statusMessage, headers) {

};

function writeProcessing() {

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
