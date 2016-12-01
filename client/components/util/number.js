'use strict';


function isInt(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
}

function isNumber(obj) { return !isNaN(parseFloat(obj)) }
