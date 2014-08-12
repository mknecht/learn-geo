/*global jQuery, Snap */

(function(w, $, d3, angular, LatLon, learngeo) {
  "use strict";
  var $w = $(window);

  function choose(items) {
    return items[(Math.random() * items.length) | 0]
  }
  
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
          {anchor: "challenging",
           label: "Challenging",
           selectsLevel: 'challenging',
           explanation: "<b>Location map</b> with region borders, no terrain, no markers.<br>" +
           "<b>Point</b> to the right location.<br>" +
           "Don't worry, we're <b>not overly picky</b>!"
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
            layers: ['topo-map', 'markers', 'question']
          },
          challenging: {
            layers: ['location-map', 'selection', 'question']
          },
          crazy: {
            layers: ['blank-map', 'selection', 'question']
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
          $scope.layers = $.extend([], levels[globalState.level].layers)
        }
        updateScope()
        $scope.globalState = globalState
        $scope.$watch('globalState.level', updateScope)
      }])
    
    app.controller('MenuCtrl', [
      '$scope', 'globalState', 'menuItems',
      function($scope, globalState, menuItems) {
        $scope.items = menuItems
        $scope.selectMenuItem = function(item) {
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

    app.controller('LocationMapCtrl', [
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
                                              {label: "Auckland", loc: new LatLon(-36.840417, 174.739869), area: 1086},
                                              {label: "Christchurch", loc: new LatLon(-43.53, 172.620278), area: 608},
                                              {label: "Dunedin", loc: new LatLon( -45.866667, 170.5), area: 255},
                                              {label: "Gisborne", loc: new LatLon(-38.6625, 178.017778), area: 85},
                                              {label: "Hamilton", loc: new LatLon(-37.783333, 175.283333), area: 877},
                                              {label: "Invercargill", loc: new LatLon(-46.413056, 168.3475), area: 123},
                                              {label: "Napier-Hasting", loc: new LatLon(-39.583333, 176.85), area: 375},
                                              {label: "Nelson", loc: new LatLon(-41.270833, 173.283889), area: 146},
                                              {label: "New Plymouth", loc: new LatLon(-39.066667, 174.083333), area: 112},
                                              {label: "Oban", loc: new LatLon(-46.9, 168.133333), area: 17},
                                              {label: "Hamilton", loc: new LatLon(-37.783333, 175.283333), area: 877},
                                              {label: "Rotorua", loc: new LatLon(-38.137778, 176.251389), area: 89},
                                              {label: "Tauranga", loc: new LatLon(-37.683333, 176.166667), area: 178},
                                              {label: "Wellington", loc: new LatLon(-41.288889, 174.777222), area: 444},
                                              {label: "Whanganui", loc: new LatLon(-39.933333, 175.05), area: 105},
                                              {label: "Whangarai", loc: new LatLon(-35.725, 174.323611), area: 133}
                                            ].map(
                                              function(city) {
                                                var copy = $.extend({}, city)
                                                copy.local = mapping.worldToLocal(city.loc)
                                                copy.radius = Math.max(10, ((city.area/30) | 0))
                                                return copy
                                              })
                                          }])

    app.controller('CityMarkersCtrl', [
      '$scope', 'cities', 'globalState',
      function($scope, cities, globalState) {
        $scope.markers = cities.map(
          function(city) {
            return {
              city: city,
              cx: city.local[0],
              cy: city.local[1],
              r: city.radius
            }
          }
        )
        $scope.selectCity = function (city) { return globalState.selectAnswer(city) }
      }])

    app.controller('CityLabelsCtrl', [
      '$scope', 'cities', 'globalState',
      function($scope, cities, globalState) {
        $scope.cities = cities.map(
          function(city) {
            return {
              fontsize: Math.max(city.radius, 15),
              label: city.label,
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

    app.controller('QandACtrl', [
      '$scope',
      'globalState',
      function($scope, globalState) {
        var positive_tagline = [
          "Done like a Kiwi!",
          "Good job!",
          "Master of Geography!"
        ]
        var negative_tagline = [
          "No worries! A Tui wouldn't have known either!",
          "Try again! It's been a long day, hasn't it?",
          "It's okay. Next time you'll guess right!"
        ]
        var choices = ['Auckland', 'Christchurch', 'Oban', 'Wellington']
        $scope.answer = ""
        $scope.tagline = ""
        $scope.wantedLabel = choose(choices)
        globalState.selectAnswer = function(city) {
          var iscorrect = city.label === $scope.wantedLabel
          $scope.answer = (iscorrect ? "Jup, that's " +  city.label : "Nope, that's " + city.label)
          $scope.tagline = choose(iscorrect ? positive_tagline : negative_tagline)
          // At the end, so the layer is properly set up when shown.
          $scope.layers.push('answer')

          setTimeout(function() {
            globalState.level = 'menu'
            $scope.$apply()
          }, 3000)
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
