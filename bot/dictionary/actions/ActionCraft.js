pk_dict = require('../dictionary.js');
Modifier = require('../Modifier.js');
ModDescriptor = require('../ModDescriptor.js');

/**
 * contains the basic Mine action of the minecraft bot
 */
function ActionCraft(bot, data, mod) {
  this.eventType = 'craft';
  this.bot = bot;
  this.mod = (mod == null) ? (new Modifier()) : mod;

  this.mod = pk_dict.interpretModifiers(bot, data.prt, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.advmod, this.mod);

  this.mod = pk_dict.interpretModifiers(bot, data.dobj, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.pobj, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.prep, this.mod);

  this.table = null;
  this.done = false;
}
ActionCraft.prototype.setup = function(cq) {
  // find crafting table
  this.bot.scanNearby(this.bot);
  var tables = this.bot.getBlockType(this.bot, new Array("workbench"));

  var closestTable = null;
  var closestDist = 0;
  for (var i in tables) {
    var d = this.bot.position.distanceTo(tables[i].position);

    if (closestTable == null || d < closestDist) {
      closestTable = tables[i];
      closestDist = d;
    }
  }
  this.table = closestTable;

  if (this.bot.canDigBlock(this.table)) {
    return true;
  }
  else {
    actMove = new ActionMove(Modifier.createDest(this.mod.targets));
    cq.prependActions(actMove);
    return false;
  }
}
ActionCraft.prototype.execute = function() {
  this.mod.interpretTarget(this.mod, this.bot);

  if (this.mod.dest) {
    // craft this.mod.dest.target
    var recipes = this.bot.recipesFor(this.mod.dest.target, null, 1, this.table);
    closureCraft(this, recipes, 0);
  }
}
ActionCraft.prototype.completed = function() {
  return this.done;
}

function closureCraft(self, recipes, index) {
  return function() { craftRecipes(self, recipes, index); };
}
function craftRecipes(self, recipes, index) {
  if (index >= recipes.length) {
    console.log(self.bot.inventory);
    self.done = true;
  }

  self.bot.craft(recipes[index], 1, self.mod.dest.count, self.table,
                 closureCraft(recipes, index + 1, self));
}

module.exports = ActionCraft;

