const dgram = require('./src/dgram');
const ws = require('./src/ws');
var s = new dgram.Socket();


/*
var port = 8080;
var dgrams = new mylink(port).dgram;
var dgramc = new mylink('localhost:'+port).dgram;

dgrams.on('message', (data) => {
  console.log('dgrams.message:', data);
});
dgramc.send('test');
*/
