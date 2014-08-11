/*global jQuery, Snap */

(function(w, $, d3, angular, LatLon, learngeo) {
  "use strict";
  var $w = $(window);
  
  $(function() {
    var app = angular.module('citiesApp', [])
    app.factory('globalState', function () {
      return {
        height: 1700,
        level: window.location.hash.substring(1),
        width: $('body').innerWidth()
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
          easy: {
            layers: ['map', 'selection']
          },
          menu: {
            layers: ['menu']
          },
          solution: {
            layers: ['map', 'solution']
          }
        }

        function updateScope() {
          $scope.currentLevel = globalState.level
          $scope.layers = levels[globalState.level].layers
        }
        updateScope()
        $scope.globalState = globalState
        $scope.$watch('globalState.level', updateScope)
      }])
    
    app.controller('MenuCtrl', [
      '$scope', 'globalState', 'menuItems',
      function($scope, globalState, menuItems) {
        $scope.items = menuItems
        $scope.select = function(item) {
          globalState.level = item.selectsLevel
        }
      }])
    
    app.controller('SvgCtrl', [
      "$scope",
      "globalState",
      "$element",
      "$document",
      function ($scope, globalState, $element, $document) {
        $scope.width = globalState.width
        $scope.height = globalState.height
        globalState.mouse = {x: 200, y:200}
        $element.bind("mousemove", function(e) {
          globalState.mouse.x = e.pageX
          globalState.mouse.y = e.pageY
          $scope.$apply()
        })
      }        
    ])
    
    app.controller('TopoMapCtrl', [
      "$scope",
      "globalState",
      function ($scope, globalState) {
        $scope.id = 'nz-map'
        $scope.width = globalState.width
        $scope.height = globalState.height
      }        
    ])

    app.factory('cities', function() {
      return [
        {name: "Auckland", loc: new LatLon(-36.840417, 174.739869), size: 30},
        {name: "Wellington", loc: new LatLon(-41.288889, 174.777222), size: 10}
      ]
    })

    app.controller('SolutionCtrl', [
      '$scope', 'cities', 'globalState',
      function($scope, cities, globalState) {
        var north = -34
        var west = 165.8
        var south = -48.3
        var east = 179.4
        var sw = new LatLon(south, west)
        var ne = new LatLon(north, east)
        $scope.cities = cities.map(
          function(city) {
            var mapping = learngeo.createMapping(ne, sw, globalState.width, globalState.height)
            var local = mapping.worldToLocal(city.loc)
            return {
              cx: local[0],
              cy: local[1],
              r: city.size
            }
          }
        )
      }])

    app.controller('SelectCtrl', [
      '$scope',
      'globalState',
      function($scope, globalState) {
        $scope.r = 20
        $scope.$watch(
          function() {
            return globalState.mouse
          },
          function(newpos) {
            $scope.cx = newpos.x
            $scope.cy = newpos.y
        }, true)
    }])
  })
  
})(window,
   require('jquery'),
   require('d3'),
   require('angular'),
   require('mt-latlon'),
   require('./geo')
  )
