'use strict';

var Event = require('./event.model');
var _ = require('lodash');


module.exports = function(req, res) {
  var reqParams = req.query;
  var id, timestamp, duration, signalLevel, direction, eventClass, deviceName;
  var param, paramName;
  var EVENT_TYPES_TO_SKIP = [
    'alert'
  ];
  var found;

  // Check event type
  paramName = 'event.type';
  param = reqParams[paramName];
  param = trimDoubleQuotes(param);
  found = _.find(EVENT_TYPES_TO_SKIP, function (eventType) {
    return eventType === param;
  });
  if (found) {
    return res.status(200).send("event with type '" + param + "' is ignored");
  }

  // Check id
  paramName = 'event.id';
  param = reqParams[paramName];
  if (!param) {
    return sendMsgParamMissing(res, paramName);
  }
  id = parseInt(param, 10);
  if (isNaN(id)) {
    return sendMsgParamInvalid(res, paramName, param);
  }

  // Check timestamp
  paramName = 'event.timestamp';
  param = reqParams[paramName];
  if (!param) {
    return sendMsgParamMissing(res, paramName);
  }
  timestamp = parseFloat(param);
  if (isNaN(timestamp)) {
    return sendMsgParamInvalid(res, paramName, param);
  }
  timestamp = new Date(timestamp * 1000);

  // Check class
  paramName = 'event.class';
  param = reqParams[paramName];
  param = trimDoubleQuotes(param);
  if (!param) {
    return sendMsgParamMissing(res, paramName);
  }
  eventClass = param;

  // Check device
  paramName = 'identity.name';
  param = reqParams[paramName];
  param = trimDoubleQuotes(param);
  if (!param) {
    return sendMsgParamMissing(res, paramName);
  }
  deviceName = param;

  // Check duration
  paramName = 'info.duration';
  param = reqParams[paramName];
  if (!param) {
    //return sendMsgParamMissing(res, paramName);
    duration = undefined;
  }
  else {
    duration = parseFloat(param);
    if (isNaN(duration)) {
      return sendMsgParamInvalid(res, paramName, param);
    }
  }

  // Check signal level
  paramName = 'info.signal_level';
  param = reqParams[paramName];
  if (!param) {
    //return sendMsgParamMissing(res, paramName);
    signalLevel = undefined;
  }
  else {
    signalLevel = parseFloat(param);
    if (isNaN(signalLevel)) {
      return sendMsgParamInvalid(res, paramName, param);
    }
  }

  // Check direction
  paramName = 'info.direction';
  param = reqParams[paramName];
  if (!param) {
    //return sendMsgParamMissing(res, paramName);
    direction = undefined;
  }
  else {
    direction = parseFloat(param);
    if (isNaN(direction)) {
      return sendMsgParamInvalid(res, paramName, param);
    }
  }

  // Create new event
  var newEvent = {
    id: id,
    timestamp: timestamp,
    class: eventClass,
    device: deviceName,
    duration: duration,
    signalLevel: signalLevel,
    direction: direction
  };
  Event.create(newEvent, function(err, event) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(event);
  });

};

function sendMsgParamMissing(res, paramName) {
  return res.status(400).send(paramName + " parameter is missing");
}

function sendMsgParamInvalid(res, paramName, param) {
  return res.status(403).send("Invalid " + paramName + " '" + param + "'");
}

function trimDoubleQuotes(s) {
  return s.replace(/^"(.*)"$/, '$1');
}
