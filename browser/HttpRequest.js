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
