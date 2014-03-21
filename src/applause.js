'use strict';

var cocktail     = require('cocktail'),
    Evented      = require('cocktail-annotation-evented'),
    _            = require('lodash'),
    plugins      = require('./plugins');

cocktail.use(Evented);

cocktail.mix({
    '@exports': module,
    '@as'     : 'class',

    '@evented': true,

    '@static' : {

        create : function (options) {
            var Applause = this;
            return new Applause(options);
        }
    },

    '@properties' : {
        options: null
    },

    _plugins : plugins,

    constructor: function (options) {
        var me = this,
            opts;

        opts = _.defaults(options, {
            patterns: [],
            prefix: options.usePrefix === false ? '': '@@',
            usePrefix: true,
            preservePrefix: false,
            delimiter: '.',
            preserveOrder: false
        });

        this.setOptions(opts);
    },

    replace : function (contents, process) {
        var me = this;
        
        try {
            // prepare patterns
            var patterns = me._prepare();
            // by default file not updated
            var updated = false;
            // iterate over each pattern and make replacement
            patterns.forEach(function (pattern) {
                var match = pattern.match;
                var replacement = pattern.replacement;
                // wrap replacement function to add process arguments
                
                if (_.isFunction(replacement)) {
                    replacement = function () {
                        var args = Array.prototype.slice.call(arguments);
                        return pattern.replacement.apply(this, args.concat(process || []));
                    };
                }
                updated = updated || contents.match(match);
                contents = contents.replace(match, replacement);
            });

            if (!updated) {
                return false;
            }
            return contents;
        } catch (e) {
            me._error(e);
        }
    },

    _prepare: function() {
        var me        = this,
            opts      = me.getOptions(),
            patterns  =  _.clone(opts.patterns),
            variables = opts.variables,
            plugins   = me._plugins;

        if (!_.isEmpty(variables)) {
            patterns.push({
                json: variables
            });
        }

        // FIXME: handler for plugin management
        var createPluginHandler = function (context) {
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

        // intercept errors
        for (var i = patterns.length - 1; i >= 0; i -= 1) {
            var context = {
                pattern: patterns[i]
            };
            // process context with each plugin
            plugins.forEach(createPluginHandler(context));
            // update current pattern
            Array.prototype.splice.apply(patterns, [i, 1].concat(context.pattern));
        }
        
        me._sortPatterns(patterns);

        // normalize definition
        return me._normalize(patterns);
    },

    _sortPatterns: function (patterns) {
        var opts = this.getOptions();

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
    },


    _normalize: function (patterns) {
        var me = this,
            opts = this.getOptions();
  
        return _.transform(patterns, function (result, pattern) {
            var match = pattern.match;
            var replacement = pattern.replacement;
            var expression = pattern.expression === true;
        
            // match check
            if (_.isRegExp(match)) {
                expression = true;
            } else if (_.isString(match)) {
                if (match.length > 0) {
                    if (expression === true) {
                        var index = match.lastIndexOf('/');
                        if (match[0] === '/' && index > 0) {
                            try {
                                match = new RegExp(match.slice(1, index), match.slice(index + 1));
                            } catch (error) {
                                me._error(error);
                                return;
                            }
                        } else {
                            me._error('Invalid expression found for match: ' + match);
                            return;
                        }
                    } else {
                        // old school
                        try {
                            match = new RegExp(opts.prefix + match, 'g');
                        } catch (error) {
                            me._error(error);
                            return;
                        }   
                    }
                } else {
                    // empty match
                    return;
                }
            } else {
                me._error('Unsupported type for match (RegExp or String expected).');
                return;
            }
            // replacement check
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
            return result.push({
                match: match,
                replacement: replacement,
                expression: expression
            });
        });

    },

    _error: function(e) {
      var message = e;
        if (e instanceof Error) {
            message = e.message;
        }
        this.emit('error', e);    
    }    

});