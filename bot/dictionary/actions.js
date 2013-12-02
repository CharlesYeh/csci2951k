/**
 * contains the most basic actions of the minecraft bot
 *
 * Move, Mine, Look, Chat
 */

// MOVE
function ActionMove(bot, data) {
  // TODO: reconsider classing direction as modifier
  this.eventType = 'move';
  this.bot = bot;

  this.dir = (data == null || data.advmod == null) ? 'forward' : data.advmod.fun.toLowerCase();
  switch (this.dir) {
    case 'backward':
    case 'backwards':
      this.dir = 'back';
      break;
  }
}
ActionMove.prototype.execute = function() {
  this.start = this.bot.entity.position.clone();
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
function ActionLook(bot, data) {
  this.bot = bot;
  this.dir = (data.prt) ? data.prt.fun : data.advmod.fun;
}
ActionLook.prototype.execute = function() {
  var pi = 3.14;
  switch(this.dir) {
    case 'straight':
    case 'forward':
      this.bot.look(pi / 4, 0);
      break;
    case 'left':
      this.bot.look(pi / 2, 0);
      break;
    case 'right':
      this.bot.look(-pi / 2, 0);
      break;
    case 'up':
      this.bot.look(0, pi / 4);
      break;
    case 'down':
      this.bot.look(0, -pi / 4);
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
function ActionChat(bot, data) {
  this.eventType = 'chat';
  this.bot = bot;
  this.msg = data.dep.fun;

}
ActionChat.prototype.execute = function() {
  this.bot.chat(this.msg);
}
ActionChat.prototype.completed = function() {
  return true;
}

exports.ActionMove = ActionMove;
exports.ActionLook = ActionLook;
exports.ActionMine = ActionMine;
exports.ActionChat = ActionChat;

