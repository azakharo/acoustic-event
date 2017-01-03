'use strict';

exports.trimDoubleQuotes = function (s) {
  return s.replace(/^"(.*)"$/, '$1');
};
