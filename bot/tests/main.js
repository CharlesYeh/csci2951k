var sys  = require('sys');
var fs = require('fs');
var MinecraftBot = require('../minecraftBot');

var inputs = process.argv.splice(2);


//Obtain address containing tests as cmdline argument
if(inputs.length <1) {
  console.log("Please input folder with tests you wish to execute");
  process.exit()
} else {
  tests_address = inputs[0];
}

//Obtain all filenames in test directory
var files = fs.readdirSync(tests_address);
var file_paths = files.map(function(file) {return tests_address+file});
console.log(file_paths);

runTests(file_paths,0);

//Function to run multiple
//Input array of test file paths (fp) and index (index)
//Starts running tests from index to end
function runTests(fp, index) {
  if(index<fp.length) {
    executeTest(fp,index,runTests);
  } else {
    console.log("Tests Completed");
  }
  console.log(index);
}
  

//Function that takes in a filepath of a test json filepath (fp) and test index (index)
//Runs the test and writes results to output (ofp)
function executeTest(fp, index, callback) {
  readJSONFile(fp[index], function(err,json) {
    if(err) {
      console.log('error!');
      throw err;
      return;
    }
    parameters = json;
    console.log(parameters);
  });
  //console.log(parameters);
  callback(fp,index+1)

 }

//Helper functions to read jsonfiles
function readJSONFile(filename, callback) {
  fs.readFile(filename, function(err,data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null,JSON.parse(data));
    } catch(e) {
      callback(e);
    }
  });
}

//var mcBot = new MinecraftBot();

//    mcBot.executeCommand(d.toString());

