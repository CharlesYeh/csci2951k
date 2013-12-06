pk_dict = require('../dictionary.js');
Modifier = require('../Modifier.js');
ModDescriptor = require('../ModDescriptor.js');

var STATE_JUMP = "jump";
var STATE_SPRINT = "sprint";

/**
 * contains the basic Move action of the minecraft bot
 */
function ActionMove(bot, data, mod) {
  this.eventType = 'move';
  this.bot = bot;
  this.mod = (mod == null) ? (new Modifier()) : mod;

  // 'back' is under prt
  this.mod = pk_dict.interpretModifiers(bot, data.prt, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.advmod, this.mod);

  this.mod = pk_dict.interpretModifiers(bot, data.dobj, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.pobj, this.mod);
  this.mod = pk_dict.interpretModifiers(bot, data.prep, this.mod);
}
ActionMove.prototype.setup = function(cq) {
  if (!this.mod.dest.point) {
    this.mod.interpretTarget(this.mod, this.bot);
  }
  
  var actions = this.bot.astar(this.bot, this.bot.entity.position, this.mod.dest.point);
  cq.prependActions(cq, actions);
}
ActionMove.prototype.execute = function() {
  this.start = this.bot.entity.position.clone();
  
  this.setDirControlState(true);

  if (this.mod.jump) {
    this.bot.setControlState(STATE_JUMP, true);
  }
  if (this.mod.fast) {
	  this.bot.setControlState(STATE_SPRINT, true);
  }

  if (this.mod.dest) {
    switch (this.mod.dest.type) {
    case ModDescriptor.DestType.SOFTTARGET:
    case ModDescriptor.DestType.HARDTARGET:
      this.bot.lookAt(this.mod.dest.point);
      break;
    case ModDescriptor.DestType.ABSOLUTE:
      this.bot.entity.yaw = this.mod.dest.dir;
      break;
    }
  }

  // if just looking, then set distance to 0 after looking
  if (this.mod.look) {
    if (!this.mod.dest) {
      var yaw = this.bot.entity.yaw;

      switch (this.mod.dir) {
      case Modifier.Dir.FORWARD:
        this.bot.look(yaw, 0);
        break;
      case Modifier.Dir.LEFT:
        this.bot.look(yaw + Math.PI / 2, 0);
        break;
      case Modifier.Dir.RIGHT:
        this.bot.look(yaw + -Math.PI / 2, 0);
        break;
      case Modifier.Dir.BACK:
        this.bot.look(yaw + Math.PI, 0);
        break;
      case Modifier.Dir.UP:
        this.bot.look(yaw, Math.PI / 4);
        break;
      case Modifier.Dir.DOWN:
        this.bot.look(yaw, -Math.PI / 4);
        break;
      }

      this.mod.dest = ModDescriptor.createQuantified(0);
    }

    this.mod.dest.type = ModDescriptor.DestType.DISTANCE;
    this.mod.dest.count = 0;
  }
}
ActionMove.prototype.completed = function() {
  if (this.mod.dest) {
    switch (this.mod.dest.type) {
    case ModDescriptor.DestType.DISTANCE:
      var movedDistance = this.bot.entity.position.distanceTo(this.start);
      console.log(movedDistance);
      completed = movedDistance > this.mod.dest.count;
      break;
    case ModDescriptor.DestType.SOFTTARGET:
    case ModDescriptor.DestType.HARDTARGET:
      completed = (this.bot.entity.position.distanceTo(this.mod.dest.point)) < 1.5;
      break;
    }
  }
  else {
    var movedDistance = this.bot.entity.position.distanceTo(this.start);
    completed = movedDistance > 1;
  }

  if (completed) {
    this.setDirControlState(false);

    if (this.mod.jump) {
      this.bot.setControlState(STATE_JUMP, false);
    }
    if (this.mod.fast) {
      this.bot.setControlState(STATE_SPRINT, false);
    }
  }

  return completed;
}
ActionMove.prototype.setDirControlState = function(val) {
  switch (this.mod.dir) {
  case Modifier.Dir.FORWARD:
  case Modifier.Dir.LEFT:
  case Modifier.Dir.RIGHT:
  case Modifier.Dir.BACK:
    this.bot.setControlState(this.mod.dir, val);
    break;
  case Modifier.Dir.UP:
  case Modifier.Dir.DOWN:
    this.bot.setControlState(Modifier.Dir.FORWARD, val);
  }
}

module.exports = ActionMove;

