'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function ($scope, $http, $timeout, socket) {
    ///////////////////////////////////////////////////////
    // Declarations

    const MODEL_NAME = 'event';

    ///////////////////////////////////////////////////////


    //=====================================================
    // Startup code

    $scope.isEventsLoaded = false;
    $scope.events = [];
    $scope.OBJECT_NAME = "Объект 1";

    //=====================================================


    //*****************************************************
    // Implementation

    $http.get('/api/events').success(function(events) {
      $scope.isEventsLoaded = true;
      $scope.events = events;
      socket.syncUpdates(MODEL_NAME, $scope.events, onNewEvent);
    });

    function onNewEvent(socketEvent, event) {
      if (socketEvent == 'created') {
        event.isNew = true;
        const elemSelector = `#event${event._id}.new-event-panel`;
        //const animClasses = 'animated flash infinite';
        // apply the animation
        $timeout(function () {
          //$(elemSelector).addClass(animClasses);
        }, 0);
        // remove animation
        $timeout(function () {
          //$(elemSelector).removeClass(animClasses);
          let animEvent = _.find($scope.events, ['_id', event._id]);
          if (animEvent) {
            animEvent.isNew = false;
          }
        }, 7000);
      }
    }

    $scope.onClearAllBtnClick = function () {
      let events = angular.copy($scope.events);
      _.forEach(events, function (e) {
        $scope.deleteEvent(e);
      });
    };

    $scope.onDelBtnClick = function (event) {
      if (event.isNew) {
        event.isNew = false;
      }
      event.isBeingDeleted = true;
      const elemSelector = `#event${event._id}.del-event-panel`;
      const animClasses = 'animated slideOutLeft';
      // apply the animation
      $timeout(function () {
        $(elemSelector).addClass(animClasses);
      }, 0);
      // remove item
      $timeout(function () {
        $scope.deleteEvent(event);
      }, 500);

    };

    $scope.deleteEvent = function(event) {
      $http.delete('/api/events/' + event._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates(MODEL_NAME);
    });

  })
  .filter('eventClassFilter', function () {
    return function (serverClass) {
      let retVal = serverClass;

      switch (serverClass) {
        case 'siren':
          retVal = 'сирена';
          break;
        case 'klaxon':
          retVal = 'клаксон';
          break;
        case 'shout':
          retVal = 'крик';
          break;
      }

      return retVal;
    };
  });
