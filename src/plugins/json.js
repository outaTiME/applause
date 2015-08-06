
/*
 * applause
 *
 * Copyright (c) 2015 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/applause/blob/master/LICENSE-MIT
 */

// dependencies

var _ = require('lodash');

// private

var flatten = function (json, delimiter) {
  var result = [];
  var createFn = function (match, replacement) {
    // prevent replace issues with $$, $&, $`, $', $n or $nn
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
    return function () {
      return replacement;
    };
  };
  var recurse = function (cur, prop) {
    for (var key in cur) {
      if (cur.hasOwnProperty(key)) {
        var item = cur[key];
        var match = prop ? prop + delimiter + key : key;
        result.push({
          match: match,
          replacement: createFn(match, item),
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

// expose

module.exports = {
  name: 'json',
  priority: 20,
  match: function (pattern, opts) {
    var json = pattern.json;
    var match = typeof json !== 'undefined';
    return match;
  },
  transform: function (pattern, opts, done) {
    var delimiter = opts.delimiter;
    var json = pattern.json;
    // function support
    if (_.isFunction(json)) {
      json.call(this, function (result) {
        // override json function with value
        json = result;
      });
    }
    if (_.isPlainObject(json)) {
      // replace json with flatten data
      done(flatten(json, delimiter));
    } else {
      done(new Error('Unsupported type for json (plain object expected).'));
    }
  }
};
