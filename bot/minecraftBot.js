require('commands.js');

function MinecraftBot() {
  this.commands = new CommandQueue();
	
	this.planner = new Planner();
	
	this.bot = mineflayer.createBot({
		host: "localhost",
		port: 25565,
	
		username: "bot",
	});
	
	// events
	bot.on('login', function() {
		console.log("Logged in");
	});
	
	// handle chat commands
	bot.on('chat', function(username, message) {
		// ignore chats by self
		if (username === bot.username) return;
		
		this.executeCommand(message);
	});
}

MinecraftBot.prototype.executeCommand = function(command) {
	
}
