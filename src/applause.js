
/*
 * applause
 *
 * Copyright (c) 2015 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/applause/blob/master/LICENSE-MIT
 */

// dependencies

var _ = require('lodash');
var plugins = require('./plugins');

// private

var createPluginHandler = function (context, opts) {
  return function (plugin) {
    var pattern = context.pattern;
    if (plugin.match(pattern, opts) === true) {
      plugin.transform(pattern, opts, function (items) {
        if (items instanceof Error) {
          throw items;
        } else {
          // store transformed pattern in context
          context.pattern = items;
        }
      });
    } else {
      // plugin doesn't apply
    }
  };
};

// took from MDN
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
var escapeRegExp = function (string) {
  return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
};

var normalize = function (applause, patterns) {
  var opts = applause.options;
  return _.transform(patterns, function (result, pattern) {
    // filter empty patterns
    if (!_.isEmpty(pattern)) {
      var match = pattern.match;
      var replacement = pattern.replacement || pattern.replace;
      var source = pattern.source;
      var expression = false;
      // match check
      if (match !== undefined && match !== null) {
        if (_.isRegExp(match)) {
          expression = true;
        } else if (_.isString(match)) {
          if (match.length > 0) {
            match = new RegExp(opts.prefix + escapeRegExp(match), 'g');
          } else {
            // empty match
            return;
          }
        } else {
          throw new Error('Unsupported match type (RegExp or String expected).');
        }
      } else {
        throw new Error('Match attribute expected in pattern definition.');
      }
      // replacement check
      if (replacement !== undefined && replacement !== null) {
        if (!_.isFunction(replacement)) {
          if (!_.isString(replacement)) {
            // transform object to string
            replacement = JSON.stringify(replacement);
          } else {
            // easy way
            if (expression === false && opts.preservePrefix === true) {
              replacement = opts.prefix + replacement;
            }
          }
        } else {
          // replace using function return value
        }
      } else {
        throw new Error('Replacement attribute expected in pattern definition.');
      }
      return result.push({
        match: match,
        replacement: replacement,
        source: source
      });
    }
  });
};

var getPatterns = function (applause) {
  var opts = applause.options;
  // shallow patterns
  var patterns = _.chain(opts.patterns)
    .clone()
    .compact()
    .filter(function (pattern) {
      return !_.isEmpty(pattern);
    })
    .value();
  // backward compatibility
  var variables = opts.variables;
  if (!_.isEmpty(variables)) {
    patterns.push({
      json: variables
    });
  }
  // intercept errors
  for (var i = patterns.length - 1; i >= 0; i -= 1) {
    var context = {
      // shared variable
      pattern: patterns[i]
    };
    // process context with each plugin
    plugins.forEach(createPluginHandler(context, opts));
    // pattern updated by plugin
    var pattern = context.pattern;
    if (!_.isArray(pattern)) {
      // convert to array
      pattern = [pattern];
    }
    var new_pattern = _.map(pattern, function (pattern) {
      return _.extend({}, pattern, {
        // link tranformed source with original pattern definition
        source: patterns[i]
      });
    });
    // attach index
    Array.prototype.splice.apply(patterns, [i, 1].concat(new_pattern));
  }
  if (opts.preserveOrder !== true) {
    // only sort non regex patterns (prevents replace issues like head, header)
    patterns.sort(function (a, b) {
      var x = a.match;
      var y = b.match;
      if (_.isString(x) && _.isString(y)) {
        return y.length - x.length;
      } else if (_.isString(x)) {
        return -1;
      }
      return 1;
    });
  }
  // normalize definition
  return normalize(applause, patterns);
};

// applause

var Applause = function (opts) {
  this.options = _.defaults(opts, {
    patterns: [],
    prefix: opts.usePrefix === false ? '': '@@',
    usePrefix: true,
    preservePrefix: false,
    delimiter: '.',
    preserveOrder: false,
    detail: false
  });
};

Applause.prototype.replace = function (contents, process) {
  var opts = this.options;
  // prevent null
  contents = contents || '';
  // prepare patterns
  var patterns = getPatterns(this);
  // match details
  var details = [];
  // iterate over each pattern and make replacement
  patterns.forEach(function (pattern, i) {
    var match = pattern.match;
    var replacement = pattern.replacement;
    // wrap replacement function to add process arguments
    if (_.isFunction(replacement)) {
      replacement = function () {
        var args = Array.prototype.slice.call(arguments);
        return pattern.replacement.apply(this, args.concat(process || []));
      };
    }
    var count = (contents.match(match) || []).length;
    if (count > 0) {
      // update contents
      contents = contents.replace(match, replacement);
      // save detail data
      details.push({
        pattern: pattern,
        source: pattern.source,
        count: count
      })
    }
  });
  if (details.length === 0) {
    contents = false;
  }
  if (opts.detail === true) {
    return {
      content: contents,
      detail: details
    }
  }
  return contents;
};

// static

Applause.create = function (opts) {
  return new Applause(opts);
};

Applause.registerPlugin = function (opts) {
  // pass
};

// expose

module.exports = Applause;
