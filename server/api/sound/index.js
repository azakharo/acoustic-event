'use strict';

var request = require('request');

module.exports = function(req, res) {
  //console.log(req.url);
  //return res.status(200).json({
  //  'ha': 'na'
  //});

  res.setHeader("content-disposition", "attachment; filename=song.mp3");
  request('http://127.0.0.1:3333/01_never_gonna_give_you_up.mp3').pipe(res);
};
