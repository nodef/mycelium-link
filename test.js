const mylink = require('./');



var port = 8080;
var dgrams = new mylink(port).dgram;
var dgramc = new mylink('localhost:'+port).dgram;

dgrams.on('message', (data) => {
  console.log('dgrams.message:', data);
});
dgramc.send('test');
