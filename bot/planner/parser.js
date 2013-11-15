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

/*
var storeJSON = function (error, stdout, stderr, callback) { 
  console.log("STORE JSON");
  json_string = stdout;
  callback(json_string);
};

var parseCommand = function (command,callb) {
  base = 'java -cp ".:/home/ec2-user/stanp/:/home/ec2-user/stanp/*" parseToJSON ';
  command = base + '"' + command + '"';
  exec(command, function(err, stdout, stderr) { storeJSON(err, stdout, stderr, callb); });
}

exports.parseCommand = parseCommand;
*/

exports.parseCommand = parseCommand;

