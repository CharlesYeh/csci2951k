/**
 * descriptor which elaborates the destination field on Modifiers
 */

function ModDescriptor(type, dir) {
  this.type = type;

  // block objects to go to
  this.targets = null;

  this.count = null;

  // set upon interpretTarget, point to go to
  this.point = null;
  this.block = null;

  // angle for look
  this.dir = dir;
}

ModDescriptor.DestType = {
  DISTANCE: 0,
  SOFTTARGET: 1,
  HARDTARGET: 2,
  ABSOLUTE: 3
}

ModDescriptor.prototype.interpretTarget = function(self, bot) {
  var targets = self.targets;
  self.targets = {}
  for (var i in targets) {
    self.targets[targets[i]] = true;
  }

  switch (self.type) {
  case ModDescriptor.DestType.SOFTTARGET:
  case ModDescriptor.DestType.HARDTARGET:
    bot.scanNearby(bot);
    matches = bot.getBlockType(bot, self.targets);

    if (matches.length == 0) {
      // TODO: didn't find a match!!
      console.log("No matches for block search");
    }
    else {
      self.block = matches[Math.floor(Math.random() * matches.length)];
      self.point = self.block.position;
    }
    break;
  }
}

/**
 * param: c - integer
 */
ModDescriptor.createQuantified = function(c) {
  var m = new ModDescriptor(ModDescriptor.DestType.DISTANCE);
  m.count = c;
  return m;
}
ModDescriptor.createSoftTargeted = function() {
  return new ModDescriptor(ModDescriptor.DestType.SOFTTARGET);
}
ModDescriptor.createHardTargeted = function() {
  return new ModDescriptor(ModDescriptor.DestType.HARDTARGET);
}
ModDescriptor.createAbsolute = function(d) {
  return new ModDescriptor(ModDescriptor.DestType.ABSOLUTE, d);
}

module.exports = ModDescriptor;

