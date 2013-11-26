function ModMove(f, d) {
  f = (f === undefined) ? false : f;
  d = (d === undefined) ? null : d;

  this.mod = true;
  this.fast = f;

  // result point
  this.dest = d;
}

exports.ModMove = ModMove;

