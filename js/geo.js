;(function (root) {
  var geomod = module.exports
  var GRAD = 60 * 60
  function LatLonSecs(lat, lon) {
    this.latSecs = lat
    this.lonSecs = lon

    this.minus = function(other) {
      return new LatLonSecs(
        this.latSecs - other.latSecs,
        this.lonSecs - other.lonSecs
      )
    }
  }

  function toSeconds(latLon) {
    function toSec(component) {
      return Math.round(component * GRAD)
    }

    return new LatLonSecs(
      toSec(latLon._lat),
      toSec(latLon._lon)
    )
  }

  function simplifyBase(latLonSecs) {
    return new LatLonSecs(
      latLonSecs.latSecs + (90 * GRAD),
      latLonSecs.lonSecs + (180 * GRAD)
    )
  }
  
  function EqRectMapping(ne, sw, width, height) {
    var baseSecs = simplifyBase(toSeconds(sw))
    var diffSecs = simplifyBase(toSeconds(ne)).minus(baseSecs)

    this.worldToLocal = function(world) {
      var worldDiffSecs = simplifyBase(toSeconds(world)).minus(baseSecs)
      return [
        width * (worldDiffSecs.lonSecs / diffSecs.lonSecs),
        height - height * (worldDiffSecs.latSecs / diffSecs.latSecs)
      ].map(Math.round)
    }
  }

  function createMapping(nw, se, width, height) {
    return new EqRectMapping(nw, se, width, height)
  }
  
  module.exports = {
    createMapping: createMapping,
    LatLonSecs: LatLonSecs,
    simplifyBase: simplifyBase,
    toSeconds: toSeconds
  }
}(this))
