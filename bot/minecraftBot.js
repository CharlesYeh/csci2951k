var ActionQueue = require('./planner/actionQueue');
var pk_planner = require('./planner/planner');
var pk_mineflayer = require('../../mineflayer/');

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
		
		mcbot.executeCommand(message + "\n");
	});
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

module.exports = MinecraftBot;

