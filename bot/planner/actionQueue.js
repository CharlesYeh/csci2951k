var Queue = require('./queue');

function ActionQueue(bot) {
  this.bot = bot;
  this.actions = new Queue();
}

ActionQueue.prototype.checkCompletion = function(cq) {
  // keep checking completion for current command, then move on to next
  if (cq.actions.size == 0) {
    return;
  }
  var curr = cq.actions.peek();

  if (curr.completed()) {
    if (curr.eventType) {
      cq.bot.removeListener(curr.eventType, function() { cq.checkCompletion(cq); });
    }

    cq.actions.dequeue();

    if (cq.actions.size > 0) {
      cq.runNextAction(cq);
    }
  }
}

ActionQueue.prototype.addActions = function(cq, cmds) {
  var prevEmpty = cq.actions.size == 0;

  for (var i = 0; i < cmds.length; i++) {
    cq.actions.enqueue(cmds[i]);
  }

  if (prevEmpty) {
    // run first command
    cq.runNextAction(cq);
  }
}

ActionQueue.prototype.runNextAction = function(cq) {
  var comm = cq.actions;
  var next = comm.peek();
  next.execute();

  if (next.eventType) {
    cq.bot.on(next.eventType, function() { cq.checkCompletion(cq); });
  }
  else {
    cq.checkCompletion(cq);
  }
}

module.exports = ActionQueue;

