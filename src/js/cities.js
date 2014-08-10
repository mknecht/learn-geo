/*global jQuery, Snap */

(function(w, $, d3, LatLon, learngeo) {
  "use strict";
  var $w = $(window);
  $(function() {
    $('img#nz-map').width($w.width());
    var svg = d3.select('body')
              .append('svg')
              .attr('id', 'cursor-shadow')
              .attr('height', 25)
              .attr('width', 25)
    var $svg = $('svg#cursor-shadow')
    /*jshint newcap:false */
    var circle = svg
                 .append('circle')
                 .attr('cx', $svg.width()/2)
                 .attr('cy', $svg.height()/2)
                 .attr('r', Math.min($svg.width(), $svg.height())/2 - 2)
    $(window).mousemove(function(e) {
      svg
      .style('left', Math.round(e.pageX - $svg.width()/2) + 'px')
      .style('top', Math.round(e.pageY - $svg.height()/2) + 'px');
    });

    var cities = [
      {name: "Auckland", loc: new LatLon(-36.840417, 174.739869), size: 30},
      {name: "Wellington", loc: new LatLon(-41.288889, 174.777222), size: 10}
    ]
    
    var north = -34
    var west = 165.8
    var south = -48.3
    var east = 179.4
    var sw = new LatLon(south, west)
    var ne = new LatLon(north, east)
    var height = $('img#nz-map').height()
    var width = $('img#nz-map').width()
    var mapping = learngeo.createMapping(ne, sw, width, height)
    
    d3.select('body')
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .style({position:'absolute', top: '0px', left: '0px'})
    .append('g')
    .selectAll('circle')
    .data(cities)
    .enter()
    .append('circle')
    .attr('class', 'city')
    .attr('r', function(d) { return d.size + 'px' })
    .attr('cx', function (d) { return mapping.worldToLocal(d.loc)[0] + 'px'})
    .attr('cy', function (d) { return mapping.worldToLocal(d.loc)[1] + 'px'})
                                                                         
  })
})(window,
   require('jquery'),
   require('d3'),
   require('mt-latlon'),
   require('./geo')
  )
