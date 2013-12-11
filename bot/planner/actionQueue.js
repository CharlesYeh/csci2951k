var Queue = require('./queue');

function ActionQueue(bot) {
  this.bot = bot;
  bot.cq = this;
  bot.checkCompletion = checkCompletion;

  this.actions = new Queue();
}

checkCompletion = function() {
  var cq = this.cq;

  // keep checking completion for current command, then move on to next
  if (cq.actions.size == 0) {
    return;
  }
  var curr = cq.actions.peek();

  if (curr.completed()) {
    console.log("ACTION COMPLETED");

    this.removeListener(curr.eventType, checkCompletion);
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

ActionQueue.prototype.prependActions = function(cq, actions) {
  for (var i = actions.length - 1; i >= 0; i--) {
    cq.actions.prepend(actions[i]);
  }
}

ActionQueue.prototype.runNextAction = function(cq) {
  var comm = cq.actions;

  var next = comm.peek();

  // back chaining, prereq checking
  while (!next.setup(cq)) {
    next = comm.peek();
  }

  next.execute();

  if (next.eventType && !next.completed()) {
    cq.bot.on(next.eventType, checkCompletion);
  }
  else {
    cq.bot.checkCompletion();
  }
}

module.exports = ActionQueue;

