var sys  = require('sys');
var MinecraftBot = require('./bot/minecraftBot');

var mcBot = new MinecraftBot();

var stdin = process.openStdin();
stdin.addListener("data", function(d) {
    mcBot.executeCommand(d.toString());
});
