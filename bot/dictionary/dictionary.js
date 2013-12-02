var ActionMove = require('./actions/ActionMove');
var ActionLook = require('./actions/ActionLook');
var ActionMine = require('./actions/ActionMine');
var ActionChat = require('./actions/ActionChat');

var ModeMove = require('./modifiers/ModMove');

// dictionary maps "dict commands" to "actions"

function Dictionary() {}

exports.Dictionary = Dictionary;

function lookupWord(bot, node) {
  var word = node.fun.toLowerCase();

  // use functions so the objects aren't all created when defining "dict"
  switch (word) {
  case "say":     return new ActionChat(bot, node);

  case "move": 	  return new ActionMove(bot, node);
  case "walk": 	  return new ActionMove(bot, node);
  case "jump": 	  return new ActionMove(bot, node);
  case "shuffle": return new ActionMove(bot, node);
  case "run": 		return new ActionMove(bot, node, new ModMove(true));

  case "look": 	  return new ActionLook(bot, node);
  case "turn": 	  return new ActionLook(bot, node);

  case "mine": 	  return new ActionMine(bot, node);
  
  // move modifiers
  case "quickly":
  case "fast":
  case "speedily":
    return new ModMove(true);

  case "forward":  return new ModMove(null, null, "forward");
  case "left":  return new ModMove(null, null, "left");
  case "right":  return new ModMove(null, null, "right");
  case "backward":
  case "backwards":
  case "back":
    return new ModMove(null, null, "back");

  case "block":
    // {num: 3}
    // {det: a}
    // dobj to move

  default:
    // unrecognized vocab
    break;
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

exports.lookupWord = lookupWord;
exports.interpretModifiers = interpretModifiers;

