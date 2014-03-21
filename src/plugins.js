
/*
 * applause
 *
 * Copyright (c) 2014 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/applause/blob/master/LICENSE-MIT
 */

// dependencies

var path = require('path');
var _ = require('lodash');

// private

var plugins = [];

// took plugins from folder

var dir = path.join(__dirname, '/plugins');
require('fs').readdirSync(dir).forEach(function (file) {
  if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
    var plugin = require(path.join(dir, file));
    // var name = plugin.name;
    plugins.push(plugin);
  }
});

// native json support

var flatten = function (json, delimiter) {
  var result = [];
  var recurse = function (cur, prop) {
    for (var key in cur) {
      if (cur.hasOwnProperty(key)) {
        var item = cur[key];
        result.push({
          match: prop ? prop + delimiter + key : key,
          replacement: item,
          expression: false
        });
        // deep scan
        if (typeof item === 'object') {
          recurse(item, prop ? prop + delimiter + key : key);
        }
      }
    }
  };
  recurse(json);
  return result;
};

// native json support (executed at last)

plugins.push({
  name: 'json',
  match: function (pattern, opts) {
    var json = pattern.json;
    var match = typeof json !== 'undefined';
    return match;
  },
  transform: function (pattern, opts, done) {
    var delimiter = opts.delimiter;
    var json = pattern.json;
    if (_.isPlainObject(json)) {
      // replace json with flatten data
      done(flatten(json, delimiter));
    } else {
      done(new Error('Unsupported type for json (plain object expected).'));
    }
  }
});

// expose

module.exports = plugins;
