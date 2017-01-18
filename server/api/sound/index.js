'use strict';

const request = require('request');
const _ = require('lodash');

module.exports = function(req, res) {
  let detectorID = req.param('detector');
  if (!detectorID) {
    let errMsg = "unknown detector";
    console.log(errMsg);
    return res.status(404).send(errMsg);
  }
  //console.log(detectorID);
  //console.log(global.detectors);

  // Get detector's IP by ID
  let detector = _.find(global.detectors, {'id': detectorID});
  //console.log(detector);
  if (!detector) {
    let errMsg = `not found IP for detector with ID '${detectorID}'`;
    console.log(errMsg);
    return res.status(404).send(errMsg);
  }
  //console.log(detector.ip);

  // Build proper url to req sound file from the detector
  let fname = req.path.substr(1);
  //console.log(fname);
  let url = `http://${detector.ip}/records/${fname}`;
  //console.log(url);

  // Proxy the request to the detector
  res.setHeader("content-disposition", `attachment; filename=${fname}`);
  request(url).auth(detector.login, detector.password).pipe(res);
};
