'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
  id: Number,
  timestamp: Date,
  class: String,
  device: String,
  duration: Number,
  snr: Number
});

module.exports = mongoose.model('Event', EventSchema);
