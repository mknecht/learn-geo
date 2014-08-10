;(function (root) {
  function EqRectMapping(nw, se) {
    this.northwest = nw
    this.southeast = se
  }

  module.exports.createMapping = function(nw, se, width, height) {
    new EqRectMapping(
      [nw, se],
      [width, height]
    )
    return [0,0]
  }
}(this))
