/**
 * param: f - whether to run
 * param: d - whether destination was specified
 * param: r - whether direction was specified
 */
function ModMove(f, d, r) {
  this.mod = true;

  this.fast = (f === undefined) ? false : f;
  this.dest = (d === undefined) ? null : d;
  this.dir  = (r === undefined) ? 'forward' : r;
}

ModMove.prototype.combine = function(mm) {
  this.fast |= mm.fast;

  if (this.dest == null) {
    this.dest = mm.dest;
  }

  if (this.dir == 'foward') {
    this.dir = mm.dir;
  }
}

module.exports = ModMove;

