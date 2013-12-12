var ModDescriptor = require("./ModDescriptor");

/**
 * param: f - whether to run
 * param: d - whether destination was specified
 * param: r - whether direction was specified
 * param: j - whether jumping
 */
function Modifier(f, d, r, j, l) {
  this.mod = true;

  this.fast = (f === undefined) ? false : f;
  this.dest = (d === undefined) ? null : d;
  this.dir  = (r == null) ? Modifier.Dir.FORWARD : r;
  this.jump = (j === undefined) ? false : j;
  this.look = (l == null) ? false : l;

  this.target = null;
}

Modifier.Dir = {
  FORWARD: "forward",
  LEFT:   "left",
  RIGHT:  "right",
  BACK:   "back",
  UP:     "up",
  DOWN:   "down"
}

Modifier.createFast = function() {
  return new Modifier(true);
}
Modifier.createDest = function(d) {
  return new Modifier(null, d);
}
Modifier.createDir = function(d) {
  return new Modifier(null, null, d);
}
Modifier.createJumping = function() {
  return new Modifier(null, null, null, true);
}
Modifier.createLook = function() {
  return new Modifier(null, null, null, null, true);
}
Modifier.createItem = function(t) {
  var m = new Modifier();
  m.target = t;
  return m;
}

Modifier.prototype.combine = function(mm) {
  this.fast |= mm.fast;
  this.jump |= mm.jump;
  this.look |= mm.look;

  if (this.dest == null) {
    this.dest = mm.dest;
  }

  if (this.dir == Modifier.Dir.FORWARD) {
    this.dir = mm.dir;
  }

  if (this.target == null) {
    this.target = mm.target;
  }
}

Modifier.prototype.interpretTarget = function(self, bot) {
  if (self.dest != null) {
    self.dest.interpretTarget(self.dest, bot);
  }
}

module.exports = Modifier;

