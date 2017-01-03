'use strict';

const EVENT2IMG = {
  'siren': {
    imgFname: 'siren.png',
    imgAlt: 'сирена'
  },
  'shout': {
    imgFname: 'shout.png',
    imgAlt: 'крик'
  },
  'klaxon': {
    imgFname: 'klaxon.png',
    imgAlt: 'клаксон'
  },
  'unknown': {
    imgFname: 'event.png',
    imgAlt: 'акуст.событие'
  }
};

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
    $scope.OBJECT_NAME = "Светофорный объект №2158";
    $scope.curPageNum = 1;
    $scope.eventsPerPage = 2;

    socket.syncUpdates(MODEL_NAME, $scope.dummyEvents, onNewEvent);
    getData();

    //=====================================================


    //*****************************************************
    // Implementation

    function getData() {
      $http.get(`/api/events?page=${$scope.curPageNum}&pagesize=${$scope.eventsPerPage}`).success(function(result) {
        $scope.isEventsLoaded = true;
        $scope.events = result.docs;
        $scope.totalEventCount = result.total;
      });
    }

    $scope.onPageNumChanged = function() {
      //log('Page changed to: ' + $scope.curPageNum);
      getData();
    };

    function onNewEvent(socketEvent, event) {
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

          $scope.events.pop();
          $scope.events.push(event);
          $scope.totalEventCount += 1;
        }
      }
      else if (socketEvent == 'remove') {
        // Try find the deleted item on current page
        let delEvent = _.find($scope.events, ['_id', event._id]);
        // If found
        if (delEvent) {
          animItemDel(event);
          $timeout(function () {
            getData();
          }, 500);
        }
      }
    }

    $scope.onClearAllBtnClick = function () {
      let events = angular.copy($scope.events);
      _.forEach(events, function (e) {
        $scope.deleteEvent(e);
      });
    };

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

    $scope.onDelBtnClick = function (event) {
      animItemDel(event);
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

    $scope.getEventImgFname = function (event) {
      let imgFname = EVENT2IMG['unknown'].imgFname;

      switch (event.class) {
        case 'siren':
        case 'klaxon':
        case 'shout':
          imgFname = EVENT2IMG[event.class].imgFname;
          break;
      }

      return imgFname;
    };

    $scope.getEventImgAlt = function (event) {
      let imgFname = EVENT2IMG['unknown'].imgAlt;

      switch (event.class) {
        case 'siren':
        case 'klaxon':
        case 'shout':
          imgFname = EVENT2IMG[event.class].imgAlt;
          break;
      }

      return imgFname;
    };

    $scope.getDownloadLink = function (event) {
      let dt = moment(event.timestamp).format('YYYY-MM-DD-HH-mm-ss');
      return `http://admin:admin@${event.sourceIP}/records/record-${dt}-${event.eventType}-${event.class}.wav`;
    };

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
  })
  .filter('trusted', ['$sce', function ($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  }]);
