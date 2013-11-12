var actions = require('../planner/actions');

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
    "say": new actions.ActionChat(bot, rep),

    "move": new actions.ActionMove(bot, rep),
    "walk": new actions.ActionMove(bot, rep),
    "run": new actions.ActionMove(bot, rep),

    "look": new actions.ActionLook(bot, rep),
    "mine": new actions.ActionMine(bot, rep)
  }

  return dict[word];
}

exports.lookupWord = lookupWord;

