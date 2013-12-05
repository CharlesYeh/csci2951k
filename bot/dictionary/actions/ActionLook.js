pk_dict = require('../dictionary.js');
Modifier = require('../Modifier.js');

/**
 * contains the basic Look action of the minecraft bot
 */
function ActionLook(bot, data) {
  this.bot = bot;
  this.dir = (data.prt) ? data.prt.fun : data.advmod.fun;
}
ActionLook.prototype.execute = function() {
  var pi = 3.14;
  switch(this.dir) {
    case 'straight':
    case 'forward':
      this.bot.look(pi / 4, 0);
      break;
    case 'left':
      this.bot.look(pi / 2, 0);
      break;
    case 'right':
      this.bot.look(-pi / 2, 0);
      break;
    case 'up':
      this.bot.look(0, pi / 4);
      break;
    case 'down':
      this.bot.look(0, -pi / 4);
      break;
  }
}
ActionLook.prototype.completed = function() {
  return true;
}

module.exports = ActionLook;

