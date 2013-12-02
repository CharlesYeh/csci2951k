var pk_dict = require('../dictionary/dictionary');
var pk_parser = require('./parser.js');

function Planner() {}

exports.Planner = Planner;

Planner.prototype.planCommand = function(mcbot, command) {
	pk_parser.parseCommand(command, function(json) { planActions(mcbot, json); });
}

/**
 * converts parse tree into planned actions,
 * then adds them to bot's action queue
 *
 * param: actionRep = JSON object
 */
function planActions(mcbot, actionObj) {
  // use dictionary, run action functions
  actions = parseJSONAction(mcbot.bot, actionObj.root[0]);

  // TODO: check action prerequisites
  
  mcbot.addActions(mcbot, actions);
}

function parseJSONAction(bot, node) {
  var funcName = node.fun.toLowerCase();

  var func = new Array();
  func.push(pk_dict.lookupWord(bot, funcName, node));

  if (node.conj) {
		for (var i in node.conj) {
			var ret = parseJSONAction(bot, node.conj);
    	func = func.concat(ret);
		}
  }

  return func;
}
