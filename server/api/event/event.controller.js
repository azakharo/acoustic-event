'use strict';

var _ = require('lodash');
var utils = require('../../utils');


// Get list of events
exports.index = function (req, res) {
  var reqParams = req.query;
  var page = reqParams['page'];
  var pageSize = reqParams['pagesize'];
  req.app.locals.storage.find()
    .then((events) => {
      var result = {};
      result.docs = events;
      return res.status(200).json(result);
    });
};

// Get a single event
exports.show = function(req, res) {
  req.app.locals.storage.findOne(req.params._id)
    .then((event) => {
      if(err) { return handleError(res, err); }
      if(!event) { return res.status(404).send('Not Found'); }
    return res.json(event);
  });
};

// Creates a new event in the DB.
exports.create = function(req, res) {
  Event.create(req.body, function(err, event) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(event);
  });
};

// Updates an existing event in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Event.findById(req.params._id, function (err, event) {
    if (err) { return handleError(res, err); }
    if(!event) { return res.status(404).send('Not Found'); }
    var updated = _.merge(event, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(event);
    });
  });
};

// Deletes a event from the DB.
exports.destroy = function(req, res) {
  var id = req.path.slice(1);
  req.app.locals.storage.remove({_id: id})
  .then (
    function (removedCount) {
      if(removedCount === 0) { return res.status(404).send('Not Found'); }
      req.app.locals.bus.emit('remove', {_id: id});
      return res.status(200).send("OK");
    },
    function (err) {
      return handleError(res, err);
    });
};

// Deletes all events from the DB.
exports.destroyAll = function(req, res) {
  req.app.locals.storage.remove({})
  .then (
    function (removedCount) {
      return res.status(200).send("OK");
    },
    function (err) {
      return handleError(res, err);
    });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
