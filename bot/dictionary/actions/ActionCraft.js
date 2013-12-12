pk_dict = require('../dictionary');
pk_mineflayer = require('../../../../mineflayer/');
Modifier = require('../Modifier');
ModDescriptor = require('../ModDescriptor');
ActionMine = require('./ActionMine');

/**
 * contains the basic Mine action of the minecraft bot
 */
function ActionCraft(bot, data, mod) {
  this.eventType = 'time';
  this.bot = bot;
  this.mod = (mod == null) ? (new Modifier()) : mod;

  this.mod = pk_dict.interpretModifiers(bot, data.prt, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.advmod, this.mod);

  this.mod = pk_dict.interpretModifiers(bot, data.dobj, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.pobj, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.prep, this.mod);

  this.mod = pk_dict.interpretModifiers(bot, data.dep, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.acomp, this.mod);

  this.table = null;
  this.done = false;
}
ActionCraft.prototype.setup = function(cq) {
  // find crafting table
  this.startingQuantity = this.bot.inventory.count(this.mod.target);
  this.bot.scanNearby(this.bot);

  var prep = new Array();
  
  // check recipe items
  //this.recipe = pk_mineflayer.Recipe.find(this.mod.target)[0];
  this.recipe = pk_mineflayer.Recipe.find(this.mod.target)[0];
  var iter = this.recipe.ingredients ? this.recipe.ingredients : this.recipe.delta;
  for (var i = 0; i < iter.length; i++) {
    // make sure you have item
    var item = iter[i];
    var itemid = this.recipe.ingredients ? item.id : item.type;

    var i = this.bot.inventory.count(itemid);
    var req = this.recipe.ingredients ? 1 : -item.count;
    while (req > 0 && i < req) {
      // determine whether item is craftable or minable
      var r = pk_mineflayer.Recipe.find(itemid);
      
      if (!r || r.length == 0) {
        // mine
        var block = pk_mineflayer.blocks[itemid];
        var mod = ModDescriptor.createSoftTargeted();
        mod.targets = new Array(block.name);
        prep.push(new ActionMine(this.bot, {}, Modifier.createDest(mod)));

        i++;
      }
      else {
        prep.push(new ActionCraft(this.bot, {}, Modifier.createItem(itemid)));

        i+= r.count;
      }
    }
    
  }
  
  // find workbench
  if (this.recipe.requiresTable) {
    var tables = this.bot.getBlockType(this.bot, {"workbench": true});

    var closestTable = null;
    var closestDist = 0;
    for (var i in tables) {
      var d = this.bot.entity.position.distanceTo(tables[i].position);

      if (closestTable == null || d < closestDist) {
        closestTable = tables[i];
        closestDist = d;
      }
    }
    this.table = closestTable;

    if (this.bot.canDigBlock(this.table)) {
    }
    else {
      var m = ModDescriptor.createHardTargeted();

      m.point = this.table.position;
      m.block = this.table;

      actMove = new ActionMove(this.bot, {}, Modifier.createDest(m));
      prep.push(actMove);
    }
  }

  if (prep.length > 0) {
    cq.prependActions(cq, prep);
    return false;
  }
  
  return true;
}
ActionCraft.prototype.execute = function() {
  this.mod.interpretTarget(this.mod, this.bot);

  var act = this;
  var r = this.bot.recipesFor(this.recipe.type, null, 1, this.table);
  this.bot.lookAt(this.bot.entity.position);
  this.bot.craft(r[0], 1, this.table, function() {});
}
ActionCraft.prototype.completed = function() {
  if (this.startingQuantity < this.bot.inventory.count(this.mod.target)) {
    this.bot.navigate.stop();
    return true;
  }
  else {
    return false;
  }
}

module.exports = ActionCraft;

