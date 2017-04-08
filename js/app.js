var app = angular.module('app', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/about", {
          templateUrl : "partials/about.html"
      })
	.otherwise({
        templateUrl : "partials/home.html"
    })
})

app.controller('ctrl', function($scope, $location, $http, $rootScope, $filter) {

var MAX_SPEED = 30;

$scope.selected = {};
$scope.rideData = [];
var data;

var lineGraph;
var avgSpeed;
var totalDist;

	$(document).ready(function(){
		console.log("document loaded");
		$(window).load(function()
		{
        $scope.setup();
		});




	});

  $scope.setup = function() {
    readCSV();



  }

  readCSV = function() {

    $.ajax({type:"POST",
        url: "php/parseCSV.php",
      data: {"path":"../data/"},
      success: function(data, success) {
        console.log(data);
        data = $.parseJSON(data);
        console.log(data);

        var reformatted = {};
        for (i = 0; i < data.length; i++) {
          reformatted = {name:data[i].name, time:[], speed:[], elevation:[], distance:[], averageSpeed:0};
          var avg = 0;
          for (j = 0; j < data[i].time.length; j++) {
            reformatted.time.push(data[i].time[j]);
            reformatted.speed.push(data[i].speed[j]);
            reformatted.elevation.push(data[i].elevation[j]);
            reformatted.distance.push(data[i].distance[j]);
            avg = avg + parseInt(data[i].speed[j]);
          }
          console.log("total speed: " + avg);
          reformatted.averageSpeed = avg / reformatted.speed.length;
          $scope.rideData.push(reformatted);
        }

      console.log($scope.rideData);

      $scope.$apply();

      }
     });
  }

  $scope.plotData = function() {
    console.log($scope.selected.ride);
    ride = $scope.selected.ride;

    var ctxLineGraph = $("#lineGraph").get(0).getContext("2d");

    if (lineGraph != null) {
      console.log("destroying chart!");
      lineGraph.destroy();
    }

    lineGraph = new Chart(ctxLineGraph, {
        type: 'line',
        data: {
            labels: ride.time,
            datasets: [{
                label: 'Speed',
                data: ride.speed,
                backgroundColor: '#54997E',
                borderWidth: 1
            },
            {
              label: 'Elevation',
              data: ride.elevation,
              borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }

    });


    var ctxAvgSpeed = $("#averageSpeed").get(0).getContext("2d");

    if (avgSpeed != null) {
      console.log("destroying chart!");
      averageSpeed.destroy();
    }

    var myChart = new Chart(ctxAvgSpeed, {
      type: 'doughnut',
      data: {
        labels: ["Average Speed", "Max Speed = 30"],
        datasets: [{
          backgroundColor: [
            "#A9CCBE",
            "#d4e5de"
          ],
          data: [ride.averageSpeed, MAX_SPEED-ride.averageSpeed]
        }]
      },
      options: {
        cutoutPercentage: 70,
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI

      }
    });



    var ctxTotalDistance = $("#distanceTraveled").get(0).getContext("2d");

    if (totalDist != null) {
      console.log("destroying chart!");
      totalDist.destroy();
    }

    totalDist = new Chart(ctxTotalDistance, {
        type: 'horizontalBar',
        data: {
            labels: [" "],
            datasets: [{
                label: "Total Distance",
                data: [ride.distance[ride.distance.length - 1]],
                backgroundColor: '#54997E',
                borderWidth: 1
            }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }],
              xAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
          }
        }

    });

  }

});
