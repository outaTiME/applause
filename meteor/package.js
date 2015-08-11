// package metadata file for Meteor.js
'use strict';

var packageName = 'outatime:applause';
var where = 'server';  // where to install: 'client' or 'server'. For both, pass nothing.

var packageJson = JSON.parse(Npm.require("fs").readFileSync('package.json'));

Package.describe({
  name: packageName,
  summary: 'Applause (official): Pattern replacer that helps create a human-friendly replaces.',
  version: packageJson.version,
  git: 'https://github.com/outaTiME/applause.git'
});

Package.onUse(function (api) {
  api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']);
  api.export('Applause', where);
  api.addFiles('meteor/export.js', where);
});

Package.onTest(function (api) {
  api.use(packageName);
  api.use('tinytest');
  api.addFiles('meteor/test.js', where);
});

Npm.depends({
  "applause": packageJson.version
});
