'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    ///////////////////////////////////////////////////////
    // Declarations

    const MODEL_NAME = 'event';

    ///////////////////////////////////////////////////////


    //=====================================================
    // Startup code

    $scope.events = [];
    $scope.OBJECT_NAME = "Объект 1";

    //=====================================================


    //*****************************************************
    // Implementation

    $http.get('/api/events').success(function(events) {
      $scope.events = events;
      socket.syncUpdates(MODEL_NAME, $scope.events);
    });

    $scope.onClearBtnClick = function () {
      let events = angular.copy($scope.events);
      _.forEach(events, function (e) {
        $scope.deleteEvent(e);
      });
    };

    $scope.deleteEvent = function(event) {
      $http.delete('/api/events/' + event._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates(MODEL_NAME);
    });

  });
