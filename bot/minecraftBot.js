var cq = require('./planner/commandQueue');
var planner = require('./planner/planner');
var mineflayer = require('../../mineflayer/');

function MinecraftBot() {
	this.planner = new planner.Planner();
	
	this.bot = mineflayer.createBot({
		host: "localhost",
		port: 25565,
	
		username: "bot",
	});

  var mcbot = this;
  this.commands = new cq.CommandQueue(this.bot);
	
	// events
	this.bot.on('login', function() {
		console.log("Logged in");
	});
	
	// handle chat commands
	this.bot.on('chat', function(username, message) {
		// ignore chats by self
		if (username === mcbot.bot.username) return;
		
		mcbot.executeCommand(message);
	});
}

exports.MinecraftBot = MinecraftBot;

MinecraftBot.prototype.executeCommand = function(command) {
  console.log("EXECUTE COMMAND " + command);
  // get array of commands from planner
	var commands = this.planner.planCommand(this.bot, command, this);
}

MinecraftBot.prototype.addActions = function(mcbot, commands) {
  mcbot.commands.addCommands(mcbot.commands, commands);
}

