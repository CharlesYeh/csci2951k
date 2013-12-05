pk_dict = require('../dictionary.js');
Modifier = require('../Modifier.js');

/**
 * contains the basic Chat action of the minecraft bot
 */
function ActionChat(bot, data) {
  this.eventType = 'chat';
  this.bot = bot;
  this.msg = data.dep.fun;

}
ActionChat.prototype.execute = function() {
  this.bot.chat(this.msg);
}
ActionChat.prototype.completed = function() {
  return true;
}

exports.ActionChat = ActionChat;

