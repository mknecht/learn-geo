/*global jQuery, Snap */

(function(w, $, d3) {
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
  });
})(window, require('jquery'), require('d3'));
