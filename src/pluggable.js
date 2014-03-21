'use strict';

var cocktail = require('cocktail'),
    path     = require('path');

cocktail.mix({
    '@exports': module,
    '@as'     : 'class',

    '@requires': [
        'addPlugin',
        'getPlugins'
    ],

    initializePlugins: function () {
        var me = this,
            dir = path.join(__dirname, '/plugins');

        require('fs').readdirSync(dir).forEach(function (file) {
          if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
            var Plugin = require(path.join(dir, file));
 
            me.addPlugin(new Plugin());
          }
        });

    },

    executePluginsInContext: function (context, opts) {
        var me = this,
            plugins = me.getPlugins(),
            pluginHandler;

        plugins.sort(function(a, b) {
            return (a.priority || 0) - (b.priority || 0);
        });

        // FIXME: handler for plugin management
        pluginHandler = function (context) {
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

        plugins.forEach(pluginHandler(context));

    }
});
