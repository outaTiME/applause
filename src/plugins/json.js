'use strict';

var cocktail = require('cocktail'),
_ = require('lodash');

cocktail.mix({
  '@exports': module,
  '@as'     : 'class',

  name      : 'json',
  priority  : 20,

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
            done(this._flatten(json, delimiter));
          } else {
            done(new Error('Unsupported type for json (plain object expected).'));
          }
        },

        _flatten : function (json, delimiter) {
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
            }

          });