/*global jQuery, Snap */

(function(w, $, Snap) {
  "use strict";
  var $w = $(window);
  $(function() {
    $('img#nz-map').width($w.width());
    var svg = $('<svg id="cursor-shadow"><rect/></svg>').appendTo('body').css({height: 25, width: 25});
    /*jshint newcap:false */
    var s = Snap('svg#cursor-shadow');
    var c = s.circle(svg.width()/2, svg.height()/2, Math.min(svg.width(), svg.height())/2 - 2);
    $(window).mousemove(function(e) {
      svg.css({left: e.pageX - svg.width()/2, top:e.pageY - svg.height()/2});
    });
  });
})(window, jQuery, Snap);
