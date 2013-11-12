var q = require('./queue');

function CommandQueue(bot) {
  this.bot = bot;
  this.commands = new q.Queue();
}

CommandQueue.prototype.checkCompletion = function(cq) {
  // keep checking completion for current command, then move on to next
  if (cq.commands.size == 0) {
    return;
  }
  var curr = cq.commands.peek();

  if (curr.completed()) {
    if (curr.eventType) {
      cq.bot.removeListener(curr.eventType, function() { cq.checkCompletion(cq); });
    }

    cq.commands.dequeue();

    if (cq.commands.size > 0) {
      cq.runNextCommand(cq);
    }
  }
}

CommandQueue.prototype.addCommands = function(cq, cmds) {
  var prevEmpty = cq.commands.size == 0;

  for (var i = 0; i < cmds.length; i++) {
    cq.commands.enqueue(cmds[i]);
  }

  if (prevEmpty) {
    // run first command
    cq.runNextCommand(cq);
  }
}

CommandQueue.prototype.runNextCommand = function(cq) {
  var comm = cq.commands;
  var next = comm.peek();
  next.execute();

  if (next.eventType) {
    cq.bot.on(next.eventType, function() { cq.checkCompletion(cq); });
  }
  else {
    cq.checkCompletion(cq);
  }
}

exports.CommandQueue = CommandQueue;

