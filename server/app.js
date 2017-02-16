/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var detectorCred = require('./detector_credentials');

var Storage = require('./storage');

var Bus = require('events');
// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
app.locals.storage = new Storage('alerts', 300);
app.locals.storage.start();
app.locals.bus = new Bus();
require('./config/socketio')(socketio, app);
require('./config/express')(app);
require('./routes')(app);

// Start monitoring cred update
detectorCred.getDetectorCredentials();
setInterval(detectorCred.getDetectorCredentials, 10000);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
