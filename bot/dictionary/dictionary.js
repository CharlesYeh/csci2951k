var actions = require('./actions');
var modmove = require('../planner/modifiers/modMove');
var mod = require('../planner/modifiers/modifiers');

// dictionary maps "dict commands" to "actions"

function Dictionary() {}

exports.Dictionary = Dictionary;

function DelayedAction(func, args) {
  this.func = func;
  this.args = args;
}

DelayedAction.prototype.exec = function(bot) {
  this.func(bot);
}

lookupWord = function(bot, word, rep) {
  dict = {
    "say": function() { return new actions.ActionChat(bot, rep) },

    "move": 	new actions.ActionMove(bot, rep),
    "walk": 	new actions.ActionMove(bot, rep),
    "run": 		new actions.ActionMove(bot, rep),
    "jump": 	new actions.ActionMove(bot, rep),
    "shuffle": 	new actions.ActionMove(bot, rep),

    "look": 	new actions.ActionLook(bot, rep),
    "turn": 	new actions.ActionLook(bot, rep),

    "mine": 	new actions.ActionMine(bot, rep),
    
    "quickly": 	new modmove.ModMove(true, null),
    "fast": 	new modmove.ModMove(true, null),
    "speedily": new modmove.ModMove(true, null)
  }

  return dict[word];
}

lookupRecursively = function(bot, word, rep) {
  var w = lookupWord(bot, word, rep);
  for (var key in w) {
	if (key == "fun") {
	}
	else {
	  lookupRecursively(bot, word, rep);
	}
  }
}

exports.lookupWord = lookupWord;

