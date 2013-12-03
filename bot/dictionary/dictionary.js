var ActionMove = require('./actions/ActionMove');
var ActionLook = require('./actions/ActionLook');
var ActionMine = require('./actions/ActionMine');
var ActionChat = require('./actions/ActionChat');

var ModDescriptor = require('./modifiers/ModDescriptor');
var ModMove = require('./modifiers/ModMove');

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
    return new ActionMove(bot, node, ModMove.createJumping());
  case "sprint":
  case "charge":
  case "run":
    return new ActionMove(bot, node, ModMove.createFast());

  // ---------- LOOK ----------
  case "look":
  case "turn":
    return new ActionLook(bot, node);

  // ---------- MINE ----------
  case "mine":
    return new ActionMine(bot, node);
  
  // ---------- MOVE MOD ----------
  // move modifiers
  case "quickly":
  case "fast":
  case "speedily":
    return ModMove.createFast();
  case "straight":
  case "forward":
    return ModMove.createDir("forward");
  case "left":  return ModMove.createDir("left");
  case "right": return ModMove.createDir("right");
  case "backward":
  case "backwards":
  case "back":
    return ModMove.createDir("back");

  // ---------- MOVE DESC ----------
  case "the":
    return ModDescriptor.createHardTargeted();
  case "a":
  case "an":
    return ModDescriptor.createSoftTargeted();

  default:
    // unrecognized vocab
    return lookupWord_objects(bot, word, node);
  }
}

function lookupWord_objects(bot, word, node) {
  switch (word) {
  case "blocks":
  case "block":
    return interpretDestination(bot, node, Targets.BLOCK);
  case "trees":
  case "tree":
    return interpretDestination(bot, node, Targets.TREE);
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

function interpretDestination(bot, node) {
  if (node.num) {
    // # blocks
    dest = lookupWord(bot, node.num[0]);
  }
  else if (node.det) {
    // the block
    dest = lookupWord(bot, node.det[0]);
  }
  dest.target = Targets.BLOCK;

  return ModMove.createDest(dest);
}

exports.lookupWord = lookupWord;
exports.interpretModifiers = interpretModifiers;

