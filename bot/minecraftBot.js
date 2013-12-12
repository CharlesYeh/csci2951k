var ActionQueue = require('./planner/actionQueue');
var pk_planner = require('./planner/planner');
var pk_mineflayer = require('../../mineflayer/');
var pk_navigate= require('../mineflayer-navigate/')(pk_mineflayer);
var pk_finder  = require('../mineflayer-blockfinder/')(pk_mineflayer);

var mcbot;

function MinecraftBot(spawnPoint, cbSpawn, cbAction) {
	this.planner = new pk_planner.Planner();
	
  var sp = new pk_mineflayer.vec3();
  if (spawnPoint) {
    sp = spawnPoint;
    console.log('manual spawn location');
  } else {
    sp.x = 1000.50;
    sp.y = 4.5;
    sp.z = 1000.50;
  }

	this.bot = pk_mineflayer.createBot({
		host: "localhost",
		port: 25565,
	  spawnPoint: sp,
		username: "bot",
	});

  pk_navigate(this.bot);
  pk_finder(this.bot);

  mcbot = this;
  this.actions = new ActionQueue(this.bot, cbAction);
	
	// events
	this.bot.on('login', function() {
		console.log("Logged in");
  });

  this.bot.on('spawn', function() {
    if (cbSpawn) {
      cbSpawn();
    }
  });

  this.bot.on('end', function() {
    console.log("Disconnected from MC server");
    process.exit();
  });
	
	// handle chat commands
	this.bot.on('chat', function(username, message) {
		// ignore chats by self
		if (username === mcbot.bot.username) return;
		
    // replace "me" with speaker's name
    message = message.replace(/([^A-Za-z])me$/g, "$1" + username);
    message = message.replace(/([^A-Za-z])me([^A-Za-z$])/g, "$1" + username + "$2");
		mcbot.executeCommand(message + "\n");
	});

  this.bot.nearbyBlocks = new Array();
  this.bot.scanNearby = mcbot.scanNearby;
  this.bot.getBlockType = mcbot.getBlockType;
}

MinecraftBot.prototype.executeCommand = function(command) {
  console.log("-------------------------");
  console.log("EXECUTE COMMAND: " + command.substring(0, command.length - 1));

  // get array of commands from planner
	var commands = this.planner.planCommand(mcbot, command);
}

// add to action queue
MinecraftBot.prototype.addActions = function(mcbot, actions) {
  mcbot.actions.addActions(mcbot.actions, actions);
}

MinecraftBot.prototype.scanNearby = function(bot) {
  var DIFF = 20;

  var pos = bot.entity.position.floored();
  var blkPos = new pk_mineflayer.vec3();

  bot.nearbyBlocks = new Array();

  for (var dx = -DIFF; dx <= DIFF; dx++) {
    for (var dz = -DIFF; dz <= DIFF; dz++) {
      var dy = 0
      //for (var dy = -DIFF; dz <= DIFF; dy++) {
        blkPos.x = pos.x + dx;
        blkPos.y = pos.y + dy;
        blkPos.z = pos.z + dz;

        blk = bot.blockAt(blkPos);
        if (blk != null && blk.name != 'air') {
          bot.nearbyBlocks.push(blk);
        }
      //}
    }
  }
}

/**
 * param: types - object acting as set of block names
 */
MinecraftBot.prototype.getBlockType = function(bot, types) {
  var matches = new Array();

  for (var i in bot.nearbyBlocks) {
    var blk = bot.nearbyBlocks[i];
    if (blk.name in types) {
      matches.push(blk);
    }
  }

  return matches;
}

MinecraftBot.prototype.teleport = function(px, py, pz) {
  this.bot.chat("/tp bot " + px + " " + py + " " + pz);
}

module.exports = MinecraftBot;

