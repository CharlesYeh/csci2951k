var sys  = require('sys');
var bot = require('./bot/minecraftBot');
var mineflayer = require('../mineflayer/');

var mcBot = new bot.MinecraftBot();

var stdin = process.openStdin();
stdin.addListener("data", function(d) {
  mcBot.executeCommand(d);
});
