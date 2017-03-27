/**
 * Broadcast updates to client when the model changes
 */

'use strict';

exports.register = function(socket, ev) {
  ev.on('alert', function (doc) {
    onSave(socket, doc);
  });
  ev.on('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('event:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('event:remove', doc);
}
