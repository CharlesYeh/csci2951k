pk_dict = require('../dictionary.js');
Modifier = require('../Modifier.js');
ModDescriptor = require('../ModDescriptor.js');

/**
 * contains the basic Mine action of the minecraft bot
 */
function ActionMine(bot, data, mod) {
  this.eventType = 'mine';
  this.bot = bot;
  this.mod = (mod == null) ? (new Modifier()) : mod;

  this.mod = pk_dict.interpretModifiers(bot, data.prt, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.advmod, this.mod);

  this.mod = pk_dict.interpretModifiers(bot, data.dobj, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.pobj, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.prep, this.mod);
}
ActionMine.prototype.canExecute = function() {
  if (!this.mod.dest.point) {
    this.mod.interpretTarget(this.mod, this.bot);
  }

  return (this.bot.canDigBlock(this.mod.dest.point));
}
ActionMine.prototype.execute = function() {
  this.mod.interpretTarget(this.mod, this.bot);

  if (this.mod.dest) {
    switch (this.mod.dest.type) {
    case ModDescriptor.DestType.SOFTTARGET:
    case ModDescriptor.DestType.HARDTARGET:
      this.bot.dig(this.mod.dest.block);
      break;
    }
  }
}
ActionMine.prototype.completed = function() {
  return true;
}

module.exports = ActionMine;

