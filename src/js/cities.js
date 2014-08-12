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
    app.factory('menuItems', [
      "$sce",
      function($sce) {
      return [
        {anchor: "easy",
         label: "Easy",
         selectsLevel: 'easy',
         explanation:"<b>Topographic map</b> with region borders.<br>" +
                    "All cities are <b>marked</b>.<br>" + 
                    "<b>Select</b> the right one!<br>"
        },
        {anchor: "crazy",
         label: "Crazy",
         selectsLevel: 'crazy',
         explanation:"<b>Outline map</b>, no terrain, no regions, no markers.<br>" +
                    "<b>Point</b> to the right location, but <b>be precise</b>!"
        },
        {anchor: "solution", label: "View Solution", selectsLevel: 'solution'}
      ].map(function (item) {
               var c = $.extend({}, item)
               c.explanation = $sce.trustAsHtml(c.explanation)
               return c
             })
    }])
    app.controller('LevelCtrl', [
      '$scope', 'globalState',
      function($scope, globalState) {
        var levels = {
          easy: {
            layers: ['topo-map', 'markers']
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
          window.location.hash = '#' + item.selectsLevel
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

    app.factory('cities', ['globalState', function(globalState) {
      var north = -34
      var west = 165.8
      var south = -48.3
      var east = 179.4
      var sw = new LatLon(south, west)
      var ne = new LatLon(north, east)
      var mapping = learngeo.createMapping(ne, sw, globalState.width, globalState.height)
      return [
        {label: "Auckland", loc: new LatLon(-36.840417, 174.739869), radius: 30},
        {label: "Wellington", loc: new LatLon(-41.288889, 174.777222), radius: 10}
      ].map(
        function(city) {
          city.local = mapping.worldToLocal(city.loc)
          return city
        })
    }])

    app.controller('CityMarkersCtrl', [
      '$scope', 'cities', 'globalState',
      function($scope, cities, globalState) {
        $scope.cities = cities.map(
          function(city) {
            return {
              cx: city.local[0],
              cy: city.local[1],
              r: city.radius
            }
          }
        )
      }])

    app.controller('CityLabelsCtrl', [
      '$scope', 'cities', 'globalState',
      function($scope, cities, globalState) {
        $scope.cities = cities.map(
          function(city) {
            return {
              label: city.label,
              fontsize: Math.max(city.radius, 15),
              x: city.local[0] + city.radius + 10,
              y: city.local[1] + (city.radius * 0.5) | 0
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
