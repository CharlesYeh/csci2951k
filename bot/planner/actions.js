// MOVE
function ActionMove(bot, data) {
  // TODO: reconsider classing direction as modifier
  this.eventType = 'move';
  this.bot = bot;

console.log("ACTION MOVE");
  console.log(data);

  this.dir = (data == null || data.advmod == null) ? 'forward' : data.advmod.fun.toLowerCase();
  switch (this.dir) {
    case 'backward':
    case 'backwards':
      this.dir = 'back';
      break;
  }

  this.start = bot.entity.position.clone();
}
ActionMove.prototype.execute = function() {
	this.bot.setControlState(this.dir, true);
}
ActionMove.prototype.completed = function() {
  completed = (this.bot.entity.position.distanceTo(this.start)) > 1;
  if (completed) {
    this.bot.setControlState(this.dir, false);
  }
  return completed;
}

// LOOK
function ActionLook(bot, dir) {
  this.eventType = 'look';
}
ActionLook.prototype.execute = function() {
  var pi = 3.14;
  switch(dir) {
    case 'left':
      bot.look(pi / 2, 0);
      break;
    case 'right':
      bot.look(-pi / 2, 0);
      break;
    case 'up':
      bot.look(0, pi / 2);
      break;
    case 'down':
      bot.look(0, -pi / 2);
      break;
  }
}
ActionLook.prototype.completed = function() {
  return true;
}

// MIN
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

// CHAT
function ActionChat(bot, msg) {
  this.eventType = 'chat';
  this.bot = bot;
}
ActionChat.prototype.execute = function() {
  bot.chat(msg);
}
ActionChat.prototype.completed = function() {
  return true;
}

exports.ActionMove = ActionMove;
exports.ActionLook = ActionLook;
exports.ActionMine = ActionMine;
exports.ActionChat = ActionChat;

