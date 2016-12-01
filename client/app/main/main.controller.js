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

    //=====================================================


    //*****************************************************
    // Implementation

    $http.get('/api/events').success(function(events) {
      $scope.events = events;
      socket.syncUpdates(MODEL_NAME, $scope.events);
    });

    $scope.onClearBtnClick = function () {
      log('onClearBtnClick is NOT implemented yet');
    };

    $scope.deleteThing = function(event) {
      $http.delete('/api/events/' + event._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates(MODEL_NAME);
    });

  });
