function ModDescriptor(type) {
  this.type = type;
  this.target = null;

  this.count = null;
}

ModDescriptor.DestType = {
  DISTANCE: 0,
  SOFTTARGET: 1,
  HARDTARGET: 2
}

ModDescriptor.setTarget = function(bot, target) {
}

/**
 * param: c - integer
 */
ModDescriptor.createQuantified = function(c) {
  var m = new ModDescriptor(ModDescriptor.DestType.DISTANCE);
  m.count = c;
  return m;
}
ModDescriptor.createLooseTargeted = function() {
  return new ModDescriptor(ModDescriptor.DestType.SOFTTARGET);
}
ModDescriptor.createHardTargeted = function() {
  return new ModDescriptor(ModDescriptor.DestType.HARDTARGET);
}

module.exports = ModDescriptor;

