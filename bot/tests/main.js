//DEPENDENCIES
var sys  = require('sys');
var fs = require('fs');
var MinecraftBot = require('../minecraftBot');
var pk_mineflayer = require('../../../mineflayer');

//MAIN

function main() {

  //Obtain address containing tests as cmdline argument
  var inputs = process.argv.splice(2);
  if(inputs.length <1) {
    console.log("Please input folder with tests you wish to execute");
    process.exit()
  } else {
    tests_address = inputs[0];
  }

  //Obtain filenames
  var file_paths = getFilePaths(tests_address);

  //Read files and print test Objects;
  getTestObjects(file_paths, function(test_objects) {
    console.log(test_objects);
  });

  //Create bot
  
  var sp = position([-634,4,-1212]);

  var mcBot = new MinecraftBot(sp, function() {
    console.log(mcBot.bot.spawnPoint);
    console.log(mcBot.bot.entity.position);
    //teleportBot(mcBot,[-600,3,4]);
    //console.log(mcBot.bot.entity.position);
  }, function() {
    console.log(mcBot.bot.entity.position);
    mcBot.bot.navigate(sp);
    });
}

main();


//HELPER FUNCTIONS

function position(loc) {
  var sp = new pk_mineflayer.vec3();
  sp.x = loc[0];
  sp.y = loc[1];
  sp.z = loc[2];
  return sp;
}

//Function to teleport bot
function teleportBot(bot,loc) {
  var new_pos = new pk_mineflayer.vec3();
  new_pos.x = loc[0];
  new_pos.y = loc[1];
  new_pos.z = loc[2];
  bot.bot.entity.position = new_pos;
}

//Function to obtain all filenames in input directory
function getFilePaths(dir_address) {
  var files = fs.readdirSync(dir_address);
  var file_paths = files.map(function(file) {return dir_address+file});
  return file_paths;
}

//Function to read in array of file paths, return array of test objects
//**ASYNC
function getTestObjects(file_paths, callback) {
  test_objects = {};
  test_objects_ordered = [];
  num_files = file_paths.length;

  function check_finish() {
    if (num_files==0) {
      for (var i=0;i<file_paths.length;i++) {
        test_objects_ordered[i] = test_objects[file_paths[i]];
      }
      callback(test_objects_ordered);
    }
  }

  function readTestObject(file_name) {
    fs.readFile(file_name, function(err,data) {
      test_objects[file_name] = JSON.parse(data);
      num_files--;
      check_finish();
    });
  }

  for (var i=0; i<file_paths.length; i++) {
    readTestObject(file_paths[i]);
  }
}


//Testing

//Function to run multiple
//Input array of test file paths (fp) and index (index)
//Starts running tests from index to end
function runTests(fp, index) {
  if(index<fp.length) {
    executeTest(fp,index,runTests);
  } else {
    console.log("Tests Completed");
  }
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
    console.log(index);
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

