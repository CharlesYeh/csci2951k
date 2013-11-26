var pk_dict = require('../dictionary/dictionary');
var pk_parser = require('./parser.js');

function Planner() {}

exports.Planner = Planner;

Planner.prototype.planCommand = function(mcbot, command) {
	pk_parser.parseCommand(command, function(json) { completeParse(mcbot, json); });
}

/**
 * converts parse tree into planned actions,
 * then adds them to bot's action queue
 *
 * param: actionRep = JSON object
 */
function completeParse(mcbot, actionRep) {
  console.log('STANFORD PARSER RESULT: ');
  console.log(actionRep.toString());

  actionRep = eval('(' + actionRep.toString() + ')');

	// use dictionary, run action functions
  actions = parseJSONAction(mcbot.bot, actionRep.root);

  // TODO: check action prerequisites
  
  mcbot.addActions(mcbot, actions);
}

function parseJSONAction(bot, node) {
  var funcName = node.fun.toLowerCase();

  var func = new Array();
  func.push(pk_dict.lookupWord(bot, funcName, node));

  if (node.conj) {
    var ret = parseJSONAction(bot, node.conj);
    func = func.concat(ret);
  }

  // TODO: recurse
  
  return func;
}
