DEFAULT_DIR = "forward";

/**
 * param: f - whether to run
 * param: d - whether destination was specified
 * param: r - whether direction was specified
 * param: j - whether jumping
 */
function ModMove(f, d, r, j) {
  this.mod = true;

  this.fast = (f === undefined) ? false : f;
  this.dest = (d === undefined) ? null : d;
  this.dir  = (r == null) ? DEFAULT_DIR : r;
  this.jump = (j === undefined) ? false : j;
}

ModMove.createFast = function() {
  return new ModMove(true);
}
ModMove.createDest = function(d) {
  return new ModMove(null, d);
}
ModMove.createDir = function(d) {
  return new ModMove(null, null, d);
}
ModMove.createJumping = function() {
  return new ModMove(null, null, null, true);
}

ModMove.prototype.combine = function(mm) {
  this.fast |= mm.fast;
  this.jump |= mm.jump;

  if (this.dest == null) {
    this.dest = mm.dest;
  }

  if (this.dir == DEFAULT_DIR) {
    this.dir = mm.dir;
  }
}

module.exports = ModMove;

