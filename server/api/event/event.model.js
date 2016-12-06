'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
  id: Number,
  timestamp: Date,
  class: String,
  eventType: String,
  device: String,
  duration: Number,
  direction: Number,
  signalLevel: Number,
  sourceIP: String
});

module.exports = mongoose.model('Event', EventSchema);
