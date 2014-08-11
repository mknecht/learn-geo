/*global jQuery, Snap */

(function(w, $, d3, angular, LatLon, learngeo) {
  "use strict";
  var $w = $(window);
  $(function() {
    function setupMouse() {
      console.log("setting up mouse!")
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
    }
    
    function setupMap() {
      var images = [{'id':'nz-map', src:'../images/nz.jpg'}]

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
      var svg = d3.select('body')
                .append('svg')
                .attr({
                  'xmlns': 'http://www.w3.org/2000/svg',
                  'xmlns:xmlns:xlink': 'http://www.w3.org/1999/xlink'
                })

      svg.selectAll('image')
      .data(images)
      .enter()
      .append('svg:image')
      .attr('id', function(d) { return d.id })
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', $w.width() + 'px')
      .attr('height', '1200px')
      .attr('xlink:href', function(d) { return d.src })

      var $img = $('image')
      var mapping = learngeo.createMapping(ne, sw, $img.width(), $img.height())
      

      svg.append('g')
      .selectAll('circle')
      .data(cities)
      .enter()
      .append('circle')
      .attr('class', 'city')
      .attr('r', function(d) { return d.size + 'px' })
      .attr('cx', function (d) { return mapping.worldToLocal(d.loc)[0] + 'px'})
      .attr('cy', function (d) { return mapping.worldToLocal(d.loc)[1] + 'px'})
    }

    var app = angular.module('citiesApp', [])
    app.factory('globalState', function () {
      return {
        level: 'menu'
      }
    })
    
    /* Menu */
    app.factory('menuItems', function() {
      return [
        {anchor: "solution", label: "View Solution", selectsLevel: 'solution'},
        {anchor: "easy", label: "Easy Test", selectsLevel: 'easy'}
      ]
    })
    app.controller('LevelCtrl', [
      '$scope', 'globalState',
      function($scope, globalState) {
        var levels = {
          menu: function() {
          },
          solution: function() {
            setupMap()
            setupMouse()
          }
        }
        
        $scope.currentLevel = globalState.level
        $scope.globalState = globalState
        $scope.$watch('globalState.level', function() {
          $scope.currentLevel = globalState.level
          levels[globalState.level]()
        })
      }])
    app.controller('MenuCtrl', [
      '$scope', 'globalState', 'menuItems',
      function($scope, globalState, menuItems) {
        $scope.items = menuItems
        $scope.select = function(item) {
          globalState.level = item.selectsLevel
        }
      }])
  })
  
})(window,
   require('jquery'),
   require('d3'),
   require('angular'),
   require('mt-latlon'),
   require('./geo')
  )
