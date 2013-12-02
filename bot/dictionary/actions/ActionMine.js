pk_dict = require('../dictionary.js');
ModMove = require('../modifiers/ModMove.js');

/**
 * contains the basic Mine action of the minecraft bot
 */
function ActionMine(bot, dir) {
  this.eventType = 'mine';
}
ActionMine.prototype.execute = function() {
  // TODO:
}
ActionMine.prototype.completed = function() {
  // TODO: base on inventory?
  return true;
}

exports.ActionMine = ActionMine;

