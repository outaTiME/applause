
/*
 * applause
 *
 * Copyright (c) 2015 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/applause/blob/master/LICENSE-MIT
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['src/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: '<%= jshint.test.src %>'
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'mochaTest']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'mochaTest']
      }
    },

    exec: {
      'meteor-init': {
        command: [
          // Make sure Meteor is installed, per https://meteor.com/install.
          // The curl'ed script is safe; takes 2 minutes to read source & check.
          'type meteor > /dev/null 2>&1 || { curl https://install.meteor.com/ | sh; }',
          // Meteor expects package.js to be in the root directory of
          // the checkout, so copy it there temporarily
          'cp meteor/package.js .'
        ].join(';')
      },
      // !- only add this if there was no "clean" task
      'meteor-cleanup': {
        // remove build files and package.js
        command: 'rm -rf .build.* versions.json package.js'
      },
      'meteor-test': {
        command: 'node_modules/.bin/spacejam --mongo-url mongodb:// test-packages ./'
      },
      'meteor-publish': {
        command: 'meteor publish'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['jshint', 'test']);

  // https://github.com/MeteorPackaging/grunt-gulp-meteor
  grunt.registerTask('meteor-test', ['exec:meteor-init', 'exec:meteor-test', 'exec:meteor-cleanup']);
  grunt.registerTask('meteor-publish', ['exec:meteor-init', 'exec:meteor-publish', 'exec:meteor-cleanup']);
  grunt.registerTask('meteor', ['exec:meteor-init', 'exec:meteor-test', 'exec:meteor-publish', 'exec:meteor-cleanup']);

};
