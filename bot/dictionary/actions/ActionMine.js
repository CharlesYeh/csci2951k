pk_dict = require('../dictionary');
Modifier = require('../Modifier');
ModDescriptor = require('../ModDescriptor');
ActionMove = require('./ActionMove');


/**
 * contains the basic Mine action of the minecraft bot
 */
function ActionMine(bot, data, mod) {
  this.eventType = 'move';
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

  // successful mine = inventory increase
  this.startQuantity = this.bot.inventory.count(this.mod.dest.block.type);

  this.bot.lookAt(this.mod.dest.block.position.offset(.5, .5, .5));
  if (this.bot.canDigBlock(this.mod.dest.block)) {
    return true;
  }
  else {
    //actMove = new ActionMove(this.bot, {}, Modifier.createDest(this.mod.targets));
    var m = ModDescriptor.createHardTargeted();
    m.point = this.mod.dest.point;
    m.block = this.mod.dest.block;

    actMove = new ActionMove(this.bot, {}, Modifier.createDest(m));
    cq.prependActions(cq, new Array(actMove));
    return false;
  }
}
ActionMine.prototype.execute = function() {

  if (this.mod.dest) {
    switch (this.mod.dest.type) {
    case ModDescriptor.DestType.SOFTTARGET:
    case ModDescriptor.DestType.HARDTARGET:
      var pos = this.mod.dest.block.position;

      var b = this.bot;
      this.bot.dig(this.mod.dest.block, function() {
        b.navigate.to(pos);
      });
      break;
    }
  }
}
ActionMine.prototype.completed = function() {
  if (this.bot.inventory.count(this.mod.dest.block.type) > this.startQuantity) {
    this.bot.navigate.stop();
    return true;
  }
  else {
    return false;
  }
}

module.exports = ActionMine;

