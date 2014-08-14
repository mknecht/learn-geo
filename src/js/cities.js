/*global jQuery, Snap */
/* Copyright (c) 2014 Murat Knecht, MIT license */

(function(w, $, d3, angular, LatLon, learngeo) {
  "use strict";
  var $w = $(window);

  function choose(items) {
    return items[(Math.random() * items.length) | 0]
  }
  
  $(function() {
    var app = angular.module('citiesApp', [])
    
    app.factory(
      'globalState', [
        'levels',
        function (levels) {
          var state = {
            height: ($('body').innerWidth() / 1200) * 1514,
            setLevel: setLevel,
            width: $('body').innerWidth()
          }
          function setLevel(newLevel) {
            state.level = newLevel
            window.location.hash = '#' + newLevel
            state.wantedLabel = choose(['Auckland', 'Christchurch', 'Oban', 'Wellington'])
            state.selectionRadius = levels[newLevel].selectionRadiusInKm;
            if (levels[newLevel].init) {
              levels[newLevel].init()
            }
          }

          setLevel(window.location.hash.substring(1) || 'menu')
          return state
        }])
    
    /* Menu */
    app.factory('menuItems', [
      "$sce",
      "levels",
      function($sce, levels) {
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
                 if (c.selectsLevel && levels[c.selectsLevel].selectionRadiusInKm) {
                   c.explanation += "<br>(The radius of selection is " +
                     levels[c.selectsLevel].selectionRadiusInKm + "km.)"
                 }
                 c.explanation = $sce.trustAsHtml(c.explanation)
                 return c
               })
      }])

    app.factory('levels', function() {
      return {
        easy: {
          layers: ['topo-map', 'markers', 'question', 'clickable-selection']
        },
        challenging: {
          layers: ['location-map', 'selection', 'question'],
          selectionRadiusInKm: 50
        },
        crazy: {
          layers: ['blank-map', 'selection', 'question'],
          selectionRadiusInKm: 10
        },
        menu: {
          init: function() {
            $("html, body").animate({ scrollTop: 0 }, "slow");
          },
          layers: ['menu']
        },
        solution: {
          layers: ['topo-map', 'markers', 'labels']
        }
      }
    })      
    
    app.controller('LevelCtrl', [
      '$scope', 'globalState', 'levels',
      function($scope, globalState, levels) {

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
        $scope.name = "levelc"
        updateScope()
        $scope.globalState = globalState
        $scope.$watch('globalState.level', updateScope)
      }])
    
    app.controller('MenuCtrl', [
      '$scope', 'globalState', 'menuItems',
      function($scope, globalState, menuItems) {
        $scope.items = menuItems
        $scope.selectMenuItem = function(item) {
          globalState.setLevel(item.selectsLevel)
        }
      }])
    
    app.controller('SvgCtrl', [
      "$scope",
      "globalState",
      "$element",
      "$document",
      function ($scope, globalState, $element, $document) {
        $scope.name = "svgc"
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
    
    app.controller('MapCtrl', [
      "$scope",
      "globalState",
      function ($scope, globalState) {
        $scope.width = globalState.width
        $scope.height = globalState.height
      }        
    ])

    app.factory('mapping', [
      'globalState',
      function(globalState) {
        var north = -34
        var west = 165.8
        var south = -48.3
        var east = 179.4
        var sw = new LatLon(south, west)
        var ne = new LatLon(north, east)
        return learngeo.createMapping(ne, sw, globalState.width, globalState.height)
      }])

    app.factory('cities', [
      'mapping',
      function(mapping) {
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
          {label: "Palmerston North", loc: new LatLon(-40.355, 175.611667), area: 178},
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
        $scope.selectCity = function (city) {
          if ($scope.layers.indexOf('clickable-selection') !== -1) {
            globalState.selectAnswer(city)
          }
        }
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
      'mapping',
      function($scope, globalState, mapping) {
        function getPixelForDistance(distance) {
          var initial = mapping.localToWorld([0,0])
          var destLocal = mapping.worldToLocal(
            initial.rhumbDestinationPoint(0, distance)
          )
          return Math.sqrt(Math.abs(Math.pow(destLocal[0],2)) +
                           Math.abs(Math.pow(destLocal[1],2)))
        }
        
        $scope.$watch(
          function() {
            return globalState.selectionRadius
          },
          function (newRadiusInKm) {
            $scope.r = getPixelForDistance(newRadiusInKm)
          })
        $scope.$watch(
          function() {
            return globalState.mouse
          },
          function(newpos) {
            $scope.cx = newpos.x
            $scope.cy = newpos.y
          }, true)
      }])

    app.factory('response', [
      'globalState',
      function(globalState) {
        var positive_taglines = [
          "Done like a Kiwi!",
          "Good job!",
          "Master of Geography!"
        ]
        var negative_taglines = [
          "No worries! A Tui wouldn't have known either!",
          "Try again! It's been a long day, hasn't it?",
          "It's okay. Next time you'll guess right!"
        ]

        var data = {
          correct: function($scope, label) {
            setModelToRespond(
              $scope,
              "Jup, that's " +  label + ".",
              positive_taglines
            )
          },
          wrong: function($scope, answer) {
            setModelToRespond(
              $scope,
              answer,
              negative_taglines
            )
          }
        }

        function setModelToRespond($scope, answer, taglines) {
          data.answer = answer
          data.tagline = choose(taglines)
          // At the end, so the layer is properly set up when shown.
          $scope.layers.push('markers')
          $scope.layers.push('labels')
          $scope.layers.push('answer')
          setTimeout(function() {
            globalState.setLevel('menu')
          }, 3000)
        }
        return data
      }])

    app.controller('QandACtrl', [
      '$scope',
      'globalState',
      'mapping',
      'cities',
      'response',
      function($scope, globalState, mapping, cities, response) {
        function setResponse(winningLabel, winningDistance, actualDistance) {
          if (winningLabel === globalState.wantedLabel) {
            if (winningDistance < globalState.selectionRadius) {
              response.correct($scope, winningLabel)
            } else {
              response.wrong(
                $scope,
                "It's the nearest, but you missed it by " + actualDistance + "km."
              )
            }
          } else {
            var textWithActualDistance = " " + globalState.wantedLabel + " is " + actualDistance + "km away.";
            if (winningDistance < globalState.selectionRadius) {
              response.wrong($scope, "Nope, that is " + winningLabel + "." + textWithActualDistance)
            } else {
              response.wrong($scope, "Nope, the nearest city is " + winningLabel + "." + textWithActualDistance)
            }
          }
        }

        $scope.response = response
        $scope.name = "qanda"
        $scope.globalState = globalState
        $scope.selectPosition = function(event) {
          var worldCoord = mapping.localToWorld([event.clientX, event.clientY + $w.scrollTop()])
          var selectionRadiusInKm = 30;
          var cities_and_distances = cities.map(
            function(city) {
              return [city, city.loc.distanceTo(worldCoord) - city.radius]
            }).sort(
              function(left, right) {
                return left[1] - right[1]
              })
          var winningLabel = cities_and_distances[0][0].label
          var winningDistance = cities_and_distances[0][1]
          var actualDistance = Math.round(
            cities_and_distances.reduce(
              // Only in ECMA6 is there a find?? I am amazed every time.
              // You gotta love fold, though. :)
              function(match, candidate) {
                return (
                  (match !== undefined) ?
                    match:
                    ((candidate[0].label === globalState.wantedLabel) ?
                     candidate :
                     undefined))
              },
              undefined
            )[1]
          );
          setResponse(winningLabel, winningDistance, actualDistance);
        }
        globalState.selectAnswer = function(city) {
          if (city.label === globalState.wantedLabel) {
            response.correct($scope, city.label)
          } else {
            response.wrong($scope, "Nope, that is " + city.label + ".")
          }
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
