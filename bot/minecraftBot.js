var ActionQueue = require('./planner/actionQueue');
var pk_planner = require('./planner/planner');
var pk_mineflayer = require('../../mineflayer/');
var pk_astar = require('../javascript-astar/astar');
var pk_graph = require('../javascript-astar/graph');

var mcbot;

function MinecraftBot() {
	this.planner = new pk_planner.Planner();
	
	this.bot = pk_mineflayer.createBot({
		host: "localhost",
		port: 25565,
	
		username: "bot",
	});

  mcbot = this;
  this.actions = new ActionQueue(this.bot);
	
	// events
	this.bot.on('login', function() {
		console.log("Logged in");
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
  this.bot.astar = mcbot.astar;
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
  var DIFF = 30;

  var pos = bot.entity.position.floored();
  var blkPos = new pk_mineflayer.vec3();

  bot.nearbyBlocks = new Array();
  grid = new Array(DIFF * 2 + 1);

  for (var dx = -DIFF; dx <= DIFF; dx++) {
    grid[dx + DIFF] = new Array(DIFF * 2 + 1);

    for (var dz = -DIFF; dz <= DIFF; dz++) {
      blkPos.x = pos.x + dx;
      blkPos.y = pos.y;
      blkPos.z = pos.z + dz;

      blk = bot.blockAt(blkPos);
      if (blk != null && blk.name != 'air') {
        bot.nearbyBlocks.push(blk);
      }

      if (blk.boundingBox == "block") {
        grid[dx + DIFF][dz + DIFF] = 0;
      }
      else {
        grid[dx + DIFF][dz + DIFF] = 1;
      }
    }
  }
  
  bot.map = new pk_graph.Graph(grid);
  bot.mapX = pos.x - DIFF;
  bot.mapZ = pos.z - DIFF;
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

/**
 * returns an array of actions
 */
MinecraftBot.prototype.astar = function(bot, start, end) {
  bot.scanNearby(bot);

  var sx = Math.floor(start.x) - bot.mapX;
  var sz = Math.floor(start.z) - bot.mapZ;
  var ptStart = bot.map.nodes[sx][sz];

  var ex = Math.floor(end.x) - bot.mapX;
  var ez = Math.floor(end.z) - bot.mapZ;
  var ptEnd = bot.map.nodes[ex][ez];
  var endBlock = ptEnd.type;
  ptEnd.type = 1;

  var path = pk_astar.search(bot.map.nodes, ptStart, ptEnd, false);
  console.log("ASTAR:  ");

  var transPath = new Array();
  for (var i in path) {
    var v = new pk_mineflayer.vec3();
    v.x = path[i].x + bot.mapX;
    v.y = start.y;
    v.z = path[i].y + bot.mapZ;
  }
  console.log(transPath);

  ptEnd.type = endBlock;
  return transPath;
}

module.exports = MinecraftBot;

