
var sys = require('sys');
var exec = require('child_process').exec;
var json_string = "";
var updated = 0;

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


