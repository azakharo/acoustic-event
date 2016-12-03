'use strict';

var Event = require('./event.model');


module.exports = function(req, res) {
  var reqParams = req.query;
  var id, timestamp, evtClass, device, duration, snr, direction;
  var param, paramName;

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
  if (!param) {
    return sendMsgParamMissing(res, paramName);
  }

  // Check device
  paramName = 'identity.name';
  param = reqParams[paramName];
  if (!param) {
    return sendMsgParamMissing(res, paramName);
  }

  // Check duration
  paramName = 'event.info.duration';
  param = reqParams[paramName];
  if (!param) {
    return sendMsgParamMissing(res, paramName);
  }
  duration = parseFloat(param);
  if (isNaN(duration)) {
    return sendMsgParamInvalid(res, paramName, param);
  }

  // Check snr
  paramName = 'event.info.snr';
  param = reqParams[paramName];
  if (!param) {
    return sendMsgParamMissing(res, paramName);
  }
  snr = parseFloat(param);
  if (isNaN(snr)) {
    return sendMsgParamInvalid(res, paramName, param);
  }

  // Check direction
  paramName = 'event.info.direction';
  param = reqParams[paramName];
  if (!param) {
    return sendMsgParamMissing(res, paramName);
  }
  direction = parseFloat(param);
  if (isNaN(snr)) {
    return sendMsgParamInvalid(res, paramName, param);
  }

  // Create new event
  var newEvent = {
    id: id,
    timestamp: timestamp,
    class: reqParams['event.class'],
    device: reqParams['identity.name'],
    duration: duration,
    snr: snr,
    direction: direction
  };
  Event.create(newEvent, function(err, event) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(event);
  });

};

function sendMsgParamMissing(res, paramName) {
  return res.status(403).send(paramName + " parameter is missing");
}

function sendMsgParamInvalid(res, paramName, param) {
  return res.status(403).send("Invalid " + paramName + " '" + param + "'");
}
