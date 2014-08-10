var LatLon = require('mt-latlon')
var learngeo = require('../js/geo')

var auckland = new LatLon(-36.840417, 174.739869)
var wellington = new LatLon(-41.288889, 174.777222)

var nw = new LatLon(-34, 165.8)
var se = new LatLon(-48.3, 179.4)

var should = require('should')

describe("Coordinate mapping module: 0,0 -> 50,50", function() {
  var se = new LatLon(0, 50)
  var nw = new LatLon(50, 0)
  var height = 100
  var width = 100
  it("Factory is defined", function() {
    learngeo.createMapping(nw, se, width, height)
    .should.be.ok
  });
  
  it("Northwest corner is (0,0)", function() {
    should.deepEqual(
      learngeo.createMapping(nw, se, width, height),
      [0, 0]
    )
  });
});

