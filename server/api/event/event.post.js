'use strict';

var Event = require('./event.model');


module.exports = function(req, res) {
  var reqParams = req.query;
  var newEvent = {
    id: parseInt(reqParams['event.id'], 10),
    timestamp: new Date(parseFloat(reqParams['event.timestamp']) * 1000),
    class: reqParams['event.class'],
    device: reqParams['identity.name'],
    duration: parseFloat(reqParams['event.info.duration']),
    snr: parseFloat(reqParams['event.info.snr'])
  };

  Event.create(newEvent, function(err, event) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(event);
  });
};
