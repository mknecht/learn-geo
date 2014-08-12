;(function (root) {
  var geomod = module.exports
  var LatLon = require('mt-latlon')
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

  function restoreBase(latLonSecs) {
    return new LatLonSecs(
      latLonSecs.latSecs - (90 * GRAD),
      latLonSecs.lonSecs - (180 * GRAD)
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

    this.localToWorld = function(local) {
      var secs = restoreBase(new LatLonSecs(
        baseSecs.latSecs + (height-local[1])/height * diffSecs.latSecs,
        baseSecs.lonSecs + local[0]/width * diffSecs.lonSecs
      ))
      return new LatLon(
        secs.latSecs / 60 / 60,
        secs.lonSecs / 60 / 60
      )
    }

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
