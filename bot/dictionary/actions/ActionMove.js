pk_dict = require('../dictionary.js');
ModMove = require('../modifiers/ModMove.js');

/**
 * contains the basic Move action of the minecraft bot
 */
function ActionMove(bot, data, mod) {
  this.eventType = 'move';
  this.bot = bot;
  this.mod = (mod == null) ? (new ModMove()) : mod;

  // 'back' is under prt
  this.mod = pk_dict.interpretModifiers(bot, data.prt, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.advmod, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.dobj, this.mod);
}
ActionMove.prototype.execute = function() {
  this.start = this.bot.entity.position.clone();
  
	this.bot.setControlState(this.mod.dir, true);

  if (this.mod.fast) {
	  this.bot.setControlState('sprint', true);
  }
}
ActionMove.prototype.completed = function() {
  completed = (this.bot.entity.position.distanceTo(this.start)) > 1;

  if (completed) {
    this.bot.setControlState(this.mod.dir, false);

    if (this.mod.fast) {
      this.bot.setControlState('sprint', false);
    }
  }

  return completed;
}

module.exports = ActionMove;

