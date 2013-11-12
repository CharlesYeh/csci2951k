var act = require('./actions');
var dict = require('../dictionary/dictionary');
var parser = require('./parser.js');

function Planner() {
	
}

exports.Planner = Planner;

Planner.prototype.planCommand = function(bot, command, mcbot) {
	// parse command => JSON obj
	parser.parseCommand(command, function(json) { completeParse(mcbot, json); });
	//completeParse(mcbot, '{root: {fun: "move"}}');
}

// actionRep = JSON object
function completeParse(mcbot, actionRep) {
  console.log('STANFORD PARSER RESULT: ');
  console.log(actionRep);
  actionRep = eval('(' + actionRep + ')');

	// use dictionary, run action functions
  actions = parseJSONAction(mcbot.bot, actionRep.root);

  // check action prerequisites
  
	// returns array of actions
  mcbot.addActions(mcbot, actions);
}

function parseJSONAction(bot, node) {
  var funcName = node.fun.toLowerCase();

  var func = new Array();
  func.push(dict.lookupWord(bot, funcName, node));

  if (node.conj) {
    var ret = parseJSONAction(bot, node.conj);
    func = func.concat(ret);
  }

  // TODO: recurse
  
  return func;
}
