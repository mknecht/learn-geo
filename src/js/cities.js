/*global jQuery, Snap */

(function(w, $, d3, angular, LatLon, learngeo) {
  "use strict";
  var $w = $(window);
  
  $(function() {
    var app = angular.module('citiesApp', [])
    
    app.factory('globalState', function () {
      return {
        height: ($('body').innerWidth() / 1200) * 1514,
        level: window.location.hash.substring(1) || 'menu',
        width: $('body').innerWidth()
      }
    })
    
    /* Menu */
    app.factory('menuItems', function() {
      return [
        {anchor: "solution", label: "View Solution", selectsLevel: 'solution'},
        {anchor: "easy", label: "Easy Test", selectsLevel: 'easy'},
        {anchor: "crazy", label: "Crazy Test", selectsLevel: 'crazy'}
      ]
    })
    app.controller('LevelCtrl', [
      '$scope', 'globalState',
      function($scope, globalState) {
        var levels = {
          easy: {
            layers: ['topo-map', 'selection', 'markers']
          },
          crazy: {
            layers: ['blank-map', 'selection']
          },
          menu: {
            layers: ['menu']
          },
          solution: {
            layers: ['topo-map', 'markers', 'labels']
          }
        }

        if ("onhashchange" in window) {
          window.addEventListener("hashchange", function(event) {
            var u = event.newURL
            globalState.level = u.indexOf('#') !== -1 ? u.substring(u.indexOf('#') + 1) : 'menu'
            $scope.$apply()
          }, false);
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
        $scope.width = globalState.width
        $scope.height = globalState.height
      }        
    ])
    
    app.controller('BlankMapCtrl', [
      "$scope",
      "globalState",
      function ($scope, globalState) {
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

    app.controller('CityMarkersCtrl', [
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
