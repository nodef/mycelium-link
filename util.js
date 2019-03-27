function toString(msg, start, end) {
  var start = start||0, end = end||msg.length;
  if(typeof msg==='string') return msg.substring(start, end);
  if(Array.isArray(msg)) return String.fromCharCode.apply(null, msg.slice(start, end));
  if(msg instanceof Uint8Array) return new TextDecoder('utf-8').decode(msg.subarray(start, end));
  return msg.toString(start, end);
};



exports.toString = toString;
