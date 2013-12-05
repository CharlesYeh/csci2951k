var ActionMove = require('./actions/ActionMove');
var ActionMine = require('./actions/ActionMine');
var ActionCraft = require('./actions/ActionCraft');
var ActionChat = require('./actions/ActionChat');

var ModDescriptor = require('./ModDescriptor');
var Modifier = require('./Modifier');

// dictionary maps "dict commands" to "actions"

function Dictionary() {}

exports.Dictionary = Dictionary;

Targets = {
  BLOCK: 0,
  TREE: 1,
  PERSON: 2
}

function lookupWord(bot, node) {
  var word = node.fun.toLowerCase();

  // check if is number
  var i = parseInt(word);
  if (!isNaN(i)) {
    return ModDescriptor.createQuantified(i);
  }

  // use functions so the objects aren't all created when defining "dict"
  switch (word) {
  case "say":     return new ActionChat(bot, node);

  // ---------- MOVE ----------
  case "move":
  case "shuffle":
  case "walk":
  case "go":
    return new ActionMove(bot, node);
  case "jump":
  case "hop":
    return new ActionMove(bot, node, Modifier.createJumping());
  case "sprint":
  case "charge":
  case "run":
    return new ActionMove(bot, node, Modifier.createFast());

  // ---------- LOOK ----------
  case "look":
  case "turn":
    return new ActionMove(bot, node, Modifier.createLook());

  // ---------- MINE ----------
  case "get":
  case "retrieve":
  case "mine":
    return new ActionMine(bot, node);
  
  // ---------- MOVE MOD ----------
  // move modifiers
  case "quickly":
  case "fast":
  case "speedily":
    return Modifier.createFast();
  case "straight":
  case "forward":
    return Modifier.createDir(Modifier.Dir.FORWARD);
  case "left":  return Modifier.createDir(Modifier.Dir.LEFT);
  case "right": return Modifier.createDir(Modifier.Dir.RIGHT);
  case "around":
  case "backward":
  case "backwards":
  case "back":
    return Modifier.createDir(Modifier.Dir.BACK);
  case "up": return Modifier.createDir(Modifier.Dir.UP);
  case "down": return Modifier.createDir(Modifier.Dir.DOWN);

  // ---------- MOVE DESC ----------
  case "the":
    return ModDescriptor.createHardTargeted();
  case "a":
  case "an":
    return ModDescriptor.createSoftTargeted();

  default:
    // check if is block name
    return lookupWord_blocks(bot, node, word);
  }
}

function lookupWord_blocks(bot, node, word) {
  switch (word) {
  case "blocks":
  case "block":
    return interpretMultDest(bot, node, new Array("stone", "grass", "dirt", "stonebrick", "wood", "sand", "gravel", "log", ""));

  case "stone":
  case "rock":
    return interpretDest(bot, node, "stone");
  case "grass":
    return interpretDest(bot, node, "grass");
  case "dirt":
    return interpretDest(bot, node, "dirt");
  case "cobblestone":
    return interpretDest(bot, node, "stonebrick");
  case "wood":
  case "plank":
  case "planks":
    return interpretDest(bot, node, "wood");
  case "sapling":
    return interpretDest(bot, node, "sapling");
  case "water":
    return interpretMultDest(bot, node, new Array("water", "waterStationary"));
  case "lava":
    return interpretMultDest(bot, node, new Array("lava", "lavaStationary"));
  case "sand":
    return interpretDest(bot, node, "sand");
  case "gravel":
    return interpretDest(bot, node, "gravel");
  case "trees":
  case "tree":
    return interpretDest(bot, node, "log");
  case "chest":
    return interpretDest(bot, node, "chest");
  case "flower":
    return interpretMultDest(bot, node, new Array("flower", "rose"));
  case "mushroom":
    return interpretMultDest(bot, node, new Array("mushroomBrown", "mushroomRed"));
  case "torch":
    return interpretDest(bot, node, "torch");
  case "rose":
    return interpretDest(bot, node, "rose");
  case "table":
  case "workbench":
    return interpretDest(bot, node, "workbench");
  case "furnace":
    return interpretMultDest(bot, node, new Array("furnace", "furnaceBurning"));
  default:
    return null;
  }
}

function interpretModifiers(bot, mods, resultMod) {
  if (mods != null) {
    for (var i in mods) {
      var node = mods[i];
      var cmod = lookupWord(bot, node);
      
      if (!cmod.mod) {
        // not a mod, TODO: error
      }
      else {
        resultMod.combine(cmod);
      }
    }
  }

  return resultMod;
}

function interpretDest(bot, node, target) {
  return interpretMultDest(bot, node, new Array(target));
}
function interpretMultDest(bot, node, targets) {
  // get ModDescriptor through type first
  if (node.num) {
    // # blocks
    dest = lookupWord(bot, node.num[0]);
  }
  else if (node.det) {
    // the block
    dest = lookupWord(bot, node.det[0]);
  }
  else {
    // assume soft
    dest = ModDescriptor.createSoftTargeted();
  }

  // dest is a ModDescriptor
  dest.targets = targets;

  return Modifier.createDest(dest);
}

exports.lookupWord = lookupWord;
exports.interpretModifiers = interpretModifiers;

