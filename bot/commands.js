
function CommandQueue() {
  this.commands = new Queue();
}

CommandQueue.checkCompletion = function() {
  // keep checking completion for current command, then move on to next
  var curr = commands.peek();

  if (curr.completed()) {
    bot.removeListener(curr.eventType, this.checkCompletion);
    commands.dequeue();

    var next = commands.peek();
    bot.on(next.eventType, this.checkCompletion);
  }
}

COMMAND_TYPES = {
  MOVE: 'MOVE',
  LOOW: 'LOOK',
  MINE: 'MINE',
  PLACE: 'PLACE',
}

function Command(type) {
  this.eventType = '';
}

Command.prototype.execute = function() {
  // execute command
}

Command.prototype.completed = function() {
  // returns true when command is complete
  return true;
}

