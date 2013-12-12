//DEPENDENCIES
var sys  = require('sys');
var fs = require('fs');
var MinecraftBot = require('../minecraftBot');
var pk_mineflayer = require('../../../mineflayer');

//GLOBAL VARIABLES
var MAP_ORIGINS = [ 
                    [-629.50, 4.50, -1246.50] ,
                    [-629.50, 4.50, -1266.50] ,
                    [-609.50, 4.50, -1246.50] ,
                    [-609.50, 4.50, -1266.50] ,
                    [-589.50, 4.50, -1246.50] ,
                    [-589.50, 4.50, -1266.50] ];
                  

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

  //Read files and run tests;
  getTestObjects(file_paths, function(test_objects) {
    executeTests(test_objects, MAP_ORIGINS);
  });

}

main();


//HELPER FUNCTIONS

//function to run all tests and record results
function executeTests(tests,maps) {
  numTests = tests.length;
  index = 0;
  test = null;

  passed_commands = '';
  failed_commands = '';

  passed = 0;
  failed = 0;

  mcBot = new MinecraftBot(toVec(maps[0]), runNextTest, evaluateTest);

  function runNextTest() {
    if(index>=numTests) {
      console.log("Tests Completed\n");
      console.log("Passed Commands:\n");
      console.log(passed_commands);
      console.log("Failed Commands:\n");
      console.log(failed_commands);
      console.log("Pass Percentage:\n");
      console.log(passed/numTests);
      return;
    }
    test = tests[index];
    teleportToMap(mcBot,test.map,maps);
    test.command = test.command += '\n'
    mcBot.executeCommand(test.command);
  }

  function evaluateTest() {
    console.log(test.title);
    posn1 = test.displacement;
    posn2 = new pk_mineflayer.vec3();
    bot_pos = mcBot.bot.entity.position;
    map_pos = maps[test.map];
    posn2.x = bot_pos.x - map_pos[0];
    posn2.y = bot_pos.y - map_pos[1];
    posn2.z = bot_pos.y - map_pos[2];
    var result = withinRange(posn1,posn2,1.0);
    if(result) {
      passed++;
      passed_commands += test.command;
    } else {
      failed++;
      failed_commands += test.command;
    }
    index++;
    runNextTest();
  }

}

//turn position array to vec3()
function toVec(posn_array) {
  var result = new pk_mineflayer.vec3();
  result.x = posn_array[0];
  result.y = posn_array[1];
  result.z = posn_array[2];
  return result;
}

//function to see if two posns are within a range
function withinRange(posn1, posn2, range) {
  var x = (Math.abs((posn1.x - posn2.x))<=range);
  var y = (Math.abs((posn1.y - posn2.y))<=range);
  var z = (Math.abs((posn1.z - posn2.z))<=range);
  return (x && y && z);
}

//function to teleport input bot to specified map
function teleportToMap(bot, map_id, map_locs) {
  var pos = map_locs[map_id];
  bot.teleport(pos[0],pos[1],pos[2]);
}

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

