var net = require('net');
var sys = require('sys');
var exec = require('child_process').exec;

var json_string = "";

parseCommand = function(command, callb) {
  var client = net.connect({port: 6789}, function() {}); 
  var data = "";

  client.on('connect', function() {
    client.write(command);
    client.on('data', function(dat) {
      data += dat;
    });
    client.on('end', function() {
      callb(data);
    });
  });
}

exports.parseCommand = parseCommand;

