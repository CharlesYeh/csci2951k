pk_dict = require('../dictionary');
Modifier = require('../Modifier');
ModDescriptor = require('../ModDescriptor');
ActionChat = require('../actions/ActionChat');

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
  // if there's a target to interpret
  if (this.mod.dest && !this.mod.dest.point) {
    this.mod.interpretTarget(this.mod, this.bot);

    if (this.mod.dest.point && !this.navigateToPoint()) {
      return false;
    }
  }

  // prerequisites handled by navigate
  return true;
}
ActionMove.prototype.navigateToPoint = function() {
  // if point is a block, then find an empty spot near it
  if (this.mod.dest.block.boundingBox == "block") {
    // TODO:
  }

  var result = this.bot.navigate.findPathSync(this.mod.dest.point, { timeout: 2 * 1000 });
  if (result.status == "success") {
    this.path = result.path;
  }
  else {
    console.log("no path!" + JSON.stringify(result));
    cq.prependActions(cq, new Array(
      new ActionChat(this.bot, { dep: [{ fun: "I can't get there!" }] }))
    );
    this.skipped = true;
    return false;
  }
}
ActionMove.prototype.execute = function() {
  if (this.skipped) {
    return;
  }

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
      if (this.mod.look) {
        this.bot.lookAt(this.mod.dest.point);
      }
      else {
        // setup in setup()
        this.bot.navigate.walk(this.path);
      }
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
  if (this.skipped) {
    return true;
  }
  var completed = false;

  if (this.mod.dest) {
    switch (this.mod.dest.type) {
    case ModDescriptor.DestType.DISTANCE:
      var movedDistance = this.bot.entity.position.distanceTo(this.start);
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

