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

  this.done = false;
}
ActionMine.prototype.setup = function(cq) {
  if (!this.mod.dest.point) {
    this.mod.interpretTarget(this.mod, this.bot);
  }

  if (this.bot.canDigBlock(this.mod.dest.point)) {
    return true;
  }
  else {
    actMove = new ActionMove(Modifier.createDest(this.mod.targets));
    cq.prependActions(actMove);
    return false;
  }
}
ActionMine.prototype.execute = function() {
  if (this.mod.dest) {
    switch (this.mod.dest.type) {
    case ModDescriptor.DestType.SOFTTARGET:
    case ModDescriptor.DestType.HARDTARGET:
      this.bot.dig(this.mod.dest.block, function() { this.done = true; });
      break;
    }
  }
}
ActionMine.prototype.completed = function() {
  return this.done;
}

module.exports = ActionMine;

