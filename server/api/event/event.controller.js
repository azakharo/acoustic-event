'use strict';

var _ = require('lodash');
var Event = require('./event.model');


function trimDoubleQuotes(s) {
  return s.replace(/^"(.*)"$/, '$1');
}

// Get list of events
exports.index = function (req, res) {
  var reqParams = req.query;
  var page = reqParams['page'];
  var pageSize = reqParams['pagesize'];
  if (page && pageSize) {
    page = parseInt(trimDoubleQuotes(page), 10);
    pageSize = parseInt(trimDoubleQuotes(pageSize), 10);
    Event.paginate({},
      {page: page, limit: pageSize, sort: {timestamp: -1}},
      function (err, result) {
        // result.docs
        // result.total
        // result.limit
        // result.page
        // result.pages
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(result);
      });
  }
  else {
    Event.find(function (err, events) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(events);
    });
  }
};

// Get a single event
exports.show = function(req, res) {
  Event.findById(req.params.id, function (err, event) {
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
  Event.findById(req.params.id, function (err, event) {
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
  Event.findById(req.params.id, function (err, event) {
    if(err) { return handleError(res, err); }
    if(!event) { return res.status(404).send('Not Found'); }
    event.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
