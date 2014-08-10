var LatLon = require('mt-latlon')
var learngeo = require('../js/geo')

var should = require('should')

GRAD = 1
MIN = GRAD / 60
SEC = MIN / 60

describe("toSeconds", function() {
  it("handle basics (0, 0)", function() {
    var latLonSec = learngeo.toSeconds(new LatLon(0, 0))
    latLonSec.latSecs.should.equal(0)
    latLonSec.lonSecs.should.equal(0)
  });
  it("handle basics (1 degree, 1 degree)", function() {
    var latLonSec = learngeo.toSeconds(new LatLon(1 * GRAD, 1 * GRAD))
    latLonSec.latSecs.should.equal(1 * 60 * 60)
    latLonSec.lonSecs.should.equal(1 * 60 * 60)
  });
  it("combined: 1 degree 1 min, 1 degree 1 min", function() {
    var latLonSec = learngeo.toSeconds(new LatLon(1 * GRAD + 2 * MIN, 1 * GRAD + 2 * MIN))
    latLonSec.latSecs.should.equal(1 * 60 * 60 + 2 * 60)
    latLonSec.lonSecs.should.equal(1 * 60 * 60 + 2 * 60)
  });
  it("combined: 1 degree 1 sec, 1 degree 1 sec", function() {
    var latLonSec = learngeo.toSeconds(new LatLon(1 * GRAD + 2 * SEC, 1 * GRAD + 2 * SEC))
    latLonSec.latSecs.should.equal(1 * 60 * 60 + 2)
    latLonSec.lonSecs.should.equal(1 * 60 * 60 + 2)
  });
})

describe("Simplify coordinates by making them positive", function() {
  var simplify = learngeo.simplifyBase
  var LatLonSecs = learngeo.LatLonSecs
  
  it("should make max negative coordinate positive", function() {
    var simple = simplify(new LatLonSecs(-90 * 60 * 60, -180 * 60 * 60))
    simple.latSecs.should.not.be.below(0)
    simple.lonSecs.should.not.be.below(0)
  })
  
  it("should keep difference", function() {
    var first = 60
    var second = -20
    var firstSimple = simplify(new LatLonSecs(first, first * 60))
    var secondSimple = simplify(new LatLonSecs(second, second * 60))
    ;(secondSimple.latSecs - firstSimple.latSecs).should.be.equal(second - first)
    ;(secondSimple.lonSecs - firstSimple.lonSecs).should.be.equal(second * 60 - first * 60)
  })
})

describe("Coordinate mapping module: 0,0 -> 50,50", function() {
  var north = 50 * GRAD
  var west = 0 * GRAD
  var south = 0 * GRAD
  var east = 50 * GRAD
  var sw = new LatLon(south, west)
  var ne = new LatLon(north, east)
  var height = 100
  var width = 100
  
  var auckland = new LatLon(-36.840417, 174.739869)
  var wellington = new LatLon(-41.288889, 174.777222)

  it("Factory is defined", function() {
    learngeo.createMapping(ne, sw, width, height)
    .should.be.ok
  });
  
  it("Northwest corner is (0,0)", function() {
    should.deepEqual(
      learngeo.createMapping(ne, sw, width, height).worldToLocal(new LatLon(north, west)),
      [0, 0]
    )
  });
  
  it("Southwest corner is (0,[image height])", function() {
    should.deepEqual(
      learngeo.createMapping(ne, sw, width, height).worldToLocal(new LatLon(south, west)),
      [0, height]
    )
  });
  
  it("Southeast corner is ([image width],[image height])", function() {
    should.deepEqual(
      learngeo.createMapping(ne, sw, width, height).worldToLocal(new LatLon(south, east)),
      [width, height]
    )
  });
});

describe("Coordinate mapping module: NZ relief map", function() {
  var north = -34
  var west = 165.8
  var south = -48.3
  var east = 179.4
  var sw = new LatLon(south, west)
  var ne = new LatLon(north, east)
  var height = 1514
  var width = 1200
  
  var auckland = new LatLon(-36.840417, 174.739869)
  var wellington = new LatLon(-41.288889, 174.777222)

  
  it("Auckland", function() {
    should.deepEqual(
      learngeo.createMapping(ne, sw, width, height).worldToLocal(auckland),
      [789,301]
    )
  });
  
  it("Wellington", function() {
    should.deepEqual(
      learngeo.createMapping(ne, sw, width, height).worldToLocal(wellington),
      [792,772]
    )
  });
});

