
/*
 * applause
 *
 * Copyright (c) 2014 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/applause/blob/master/LICENSE-MIT
 */

// dependencies

var CSON = require('cson');

// expose

module.exports = {
  name: 'cson',
  priority: 10,
  match: function (pattern, opts) {
    var cson = pattern.cson;
    var match = typeof cson !== 'undefined';
    return match;
  },
  transform: function (pattern, opts, done) {
    try {
      done({
        json: CSON.parseSync(pattern.cson)
      });
    } catch (e) {
      done(e);
    }
  }
};
