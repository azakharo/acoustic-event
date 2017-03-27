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
  .controller('EventCardCtrl', function ($http, $timeout) {

    this.OBJECT_NAME = "Светофорный объект №2158";

    this.getEventImgFname = function (event) {
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

    this.getEventImgAlt = function (event) {
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

    this.getDownloadLink = function (event) {
      if (event.eventType == 'acoustic') {
        let dt = moment(event.timestamp).format('YYYY-MM-DD-HH-mm-ss');
        return `/records/record-${dt}-${event.eventType}-${event.class}.wav?detector=${event.device}`;
      } else {
        return `/video/${event.url}`;
      }
    };


    this.onDelBtnClick = function (event) {
      this.deleteEvent(event);
    };

  })
  .component('eventCard', {
    templateUrl: 'app/main/event-card.html',
    controller: 'EventCardCtrl',
    bindings: {
      event: '=',
      deleteEvent: '&'
    }
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
        case 'powstat':
          retVal = 'уровень шума';
          break;
        case 'stopatlane':
          retVal = 'Остановка ТС в полосе';
          break;
        case 'stopatcross':
          retVal = 'Остановка ТС в зоне перекрестка';
          break;
      }

      return retVal;
    };
  })
  .filter('trusted', ['$sce', function ($sce) {
    return function (url) {
      return $sce.trustAsResourceUrl(url);
    };
  }]);
