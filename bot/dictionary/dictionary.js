var actions = require('../planner/actions');
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

    "move": function() { return new actions.ActionMove(bot, rep) },
    "walk": function() { return new actions.ActionMove(bot, rep) },
    "run": function() { return new actions.ActionMove(bot, rep) },
    "jump": function() { return new actions.ActionMove(bot, rep) },
    "shuffle": function() { return new actions.ActionMove(bot, rep) },

    "look": function() { return new actions.ActionLook(bot, rep) },
    "turn": function() { return new actions.ActionLook(bot, rep) },

    "mine": function() { return new actions.ActionMine(bot, rep) },
    
    "quickly": function() { return mod.combine(new modmove.ModMove(true, null)); },
    "fast": function() { return mod.combine(new modmove.ModMove(true, null)); },
    "speedily": function() { return mod.combine(new modmove.ModMove(true, null)); }
  }

  return dict[word]();
}

exports.lookupWord = lookupWord;

