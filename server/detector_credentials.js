'use strict';

var request = require("request");

const URL_PROCESSING = 'http://127.0.0.1:4000';
const SUBURL_DETECTOR_REGISTRY = '/registry';

global.detectors = [];

exports.getDetectorCredentials = function () {
  request({
      url: URL_PROCESSING + SUBURL_DETECTOR_REGISTRY,
      json: true
    },
    function (error, response, body) {
      if (error) {
        console.log(error);
        return;
      }
      global.detectors = body;
      //console.log(global.detectors);
    });
};
