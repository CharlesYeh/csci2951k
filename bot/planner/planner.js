var net = require('net');
var pk_dict = require('../dictionary/dictionary');

function Planner() {}

exports.Planner = Planner;

Planner.prototype.planCommand = function(mcbot, command) {
	parseCommand(command, function(json) { planActions(mcbot, json); });
}

/**
 * converts parse tree into planned actions,
 * then adds them to bot's action queue
 *
 * param: actionRep = JSON object
 */
function planActions(mcbot, actionObj) {
  console.log("JSON:" + JSON.stringify(actionObj));

  // use dictionary, run action functions
  actions = parseJSONAction(mcbot.bot, actionObj.root[0]);

  mcbot.addActions(mcbot, actions);
}

/**
 * parse the JSON representation of a command
 * into a usable list of actions
 *
 * param: node - JSON representation of command
 * returns: list of basic actions
 */
function parseJSONAction(bot, node) {
  var func = new Array();
  func.push(pk_dict.lookupWord(bot, node));

  if (node.conj != null) {
		for (var i in node.conj) {
			var ret = parseJSONAction(bot, node.conj[i]);
    	func = func.concat(ret);
		}
  }

  return func;
}

/**
 * connects to a server running the stanford parser
 * and terminates upon network connection close
 *
 * calls the function "callb" with the resulting JSON
 * representation
 */
function parseCommand(command, callb) {
  var client = net.connect({port: 6789}, function() {}); 
  var data = "";

  client.on('connect', function() {
    client.write(command);

    client.on('data', function(dat) {
      data += dat;
    });
    client.on('end', function() {
      callb((data == "") ? null : eval("(" + data.toString() + ")"));
    });
  });
}

