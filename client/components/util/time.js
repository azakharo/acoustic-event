'use strict';


function getDays(dateStart, dateEnd) {
  return _getTimeUnits(dateStart, dateEnd, 'days');
}

function getMonths(dateStart, dateEnd) {
  return _getTimeUnits(dateStart, dateEnd, 'months');
}

function getYears(dateStart, dateEnd) {
  return _getTimeUnits(dateStart, dateEnd, 'years');
}

function isToday(momnt) {
  return momnt.isSame(moment(), 'day');
}


//======================================================
// Implementation

function _getTimeUnits(dateStart, dateEnd, unitsName) {
  var units = [];
  var u = dateStart.clone();
  while (u.isBefore(dateEnd) || u.isSame(dateEnd)) {
    units.push(u);
    u = u.clone();
    u.add(1, unitsName);
  }
  return units;
}
