pk_dict = require('../dictionary.js');
ModMove = require('../modifiers/ModMove.js');
ModDescriptor = require('../modifiers/ModDescriptor.js');

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

  // move (to) where?
  this.target = null;

  this.mod = pk_dict.interpretModifiers(bot, data.dobj, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.pobj, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.prep, this.mod);
}
ActionMove.prototype.execute = function() {
  this.start = this.bot.entity.position.clone();
  
	this.bot.setControlState(this.mod.dir, true);

  if (this.mod.jump) {
    this.bot.setControlState('jump', true);
  }
  if (this.mod.fast) {
	  this.bot.setControlState('sprint', true);
  }
}
ActionMove.prototype.completed = function() {

  if (this.mod.dest) {
    switch (this.mod.dest.type) {
    case ModDescriptor.DestType.DISTANCE:
      var movedDistance = this.bot.entity.position.distanceTo(this.start);
      completed = movedDistance > this.mod.dest.count;
      break;
    case ModDescriptor.DestType.SOFTTARGET:
    case ModDescriptor.DestType.HARDTARGET:
      completed = (this.bot.entity.position.distanceTo(this.mod.dest.target)) < 1.5;
      break;
    }
  }
  else {
    var movedDistance = this.bot.entity.position.distanceTo(this.start);
    completed = movedDistance > 1;
  }

  if (completed) {
    this.bot.setControlState(this.mod.dir, false);

    if (this.mod.jump) {
      this.bot.setControlState('jump', false);
    }
    if (this.mod.fast) {
      this.bot.setControlState('sprint', false);
    }
  }

  return completed;
}

module.exports = ActionMove;

