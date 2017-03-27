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
    $scope.dummyEvents = [];
    $scope.curPageNum = 1;
    $scope.eventsPerPage = 200;

    socket.syncUpdates(MODEL_NAME, $scope.dummyEvents, onSocketEvent);
    getData();


    //////////////////////////////////////////////////////
    // Fixed Mobile Safari issue related to viewport units

    window.viewportUnitsBuggyfill.init();

    window.onresize = debounce(function () {
      window.viewportUnitsBuggyfill.refresh();
    }, 500);

    //=====================================================


    //*****************************************************
    // Implementation

    function getData() {
      $http.get(`/api/events?page=${$scope.curPageNum}&pagesize=${$scope.eventsPerPage}`).success(function(result) {
        //console.log(result);
        $scope.isEventsLoaded = true;
        $scope.events = _.sortBy(result.docs, function (evt) {
          return -evt.timestamp.getTime();
        });
        $scope.totalEventCount = result.total;
      });
    }

    $scope.onPageNumChanged = function() {
      //log('Page changed to: ' + $scope.curPageNum);
      getData();
    };

    function onSocketEvent(socketEvent, event) {
      if (socketEvent == 'created') {
        if ($scope.curPageNum == 1) {
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

          if ($scope.events.length == $scope.eventsPerPage) {
            $scope.events.pop();
          }
          $scope.events.unshift(event);
          $scope.totalEventCount += 1;
        }
      }
      else if (socketEvent == 'deleted') {
        let delEvent = _.find($scope.events, ['_id', event._id]);
        // If found
        if (delEvent) {
          animItemDel(delEvent);
          $timeout(function () {
            _.remove($scope.events, function (e) {
              return e === delEvent;
            })
          }, 500);
        }
      }
    }

    function animItemDel(event) {
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
    }


    $scope.deleteEvent = function (event) {
      // remove item
      $http.delete('/api/events/' + event._id).then(
        function (result) {
        },
        function (reason) {
          console.log("Couldn't delete event, reason: ");
          console.log(reason);
        }
      );
    };

    $scope.onClearAllBtnClick = function () {
      $http.delete('/api/events').then(
        function (result) {
          $scope.events = [];
        },
        function (reason) {
          console.log("Couldn't delete all events, reason: ");
          console.log(reason);
        }
      );
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates(MODEL_NAME);
    });

  });
