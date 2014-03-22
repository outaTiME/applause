'use strict';

var yaml     = require('js-yaml'),
cocktail = require('cocktail');

cocktail.mix({
  '@exports' : module,
  '@as'      : 'class',

  name       : 'yaml',
  priority   : 10,
  
  match: function (pattern, opts) {
    var yaml = pattern.yaml;
    var match = typeof yaml !== 'undefined';
    
    return match;
  },
  
  transform: function (pattern, opts, done) {
    try {
      done({
        json: yaml.safeLoad(pattern.yaml)
      });
    } catch (e) {
      done(e);
    }
  }

});
