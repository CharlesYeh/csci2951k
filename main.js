var sys  = require('sys');
var bot = require('./bot/minecraftBot');
var mineflayer = require('../mineflayer/');

var stdin = process.openStdin();

var mcBot = new bot.MinecraftBot();

stdin.addListener("data", function(d) {
  mcBot.executeCommand(d);
});
