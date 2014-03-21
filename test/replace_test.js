
/*
 * applause
 *
 * Copyright (c) 2014 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/applause/blob/master/LICENSE-MIT
 */

'use strict';

// dependencies

var assert = require('assert');
var Applause = require('../src/applause');

// test

describe('applause', function () {

  var applause;
  var expect;
  var result;

  it('should replace simple key with value', function (done) {

    applause = new Applause({
      patterns: [
        {
          match: 'key',
          replacement: 'value'
        }
      ]
    });
    expect = 'value';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

});

/*


'use strict';



exports['replace'] = {

  main: function (test) {

    var replacer;
    var expect;
    var result;

    test.expect(3);

    replacer = new Applause({
      patterns: [
        {
          match: 'key',
          replacement: 'value'
        }
      ]
    });
    expect = 'value';
    result = replacer.replace('@@key');
    test.equal(expect, result, 'should replace simple key with value');

    replacer = new Applause({
      patterns: [
        {
          match: 'key',
          replacement: '$$\''
        }
      ]
    });
    expect = '$\'';
    result = replacer.replace('@@key');
    test.equal(expect, result, 'should escape the dollar sign ($)');

    replacer = new Applause({
      patterns: [
        {
          match: /(\w+)\s(\w+)/,
          replacement: '$2, $1',
        }
      ]
    });
    expect = 'Smith, John';
    result = replacer.replace('John Smith');
    test.equal(expect, result, 'should replace "John Smith" for "Smith, John"');

    test.done();

  },

  json: function (test) {

    var replacer;
    var expect;
    var result;

    test.expect(1);

    replacer = new Applause({
      patterns: [
        {
          json: {
            'key': 'value'
          }
        }
      ]
    });
    expect = 'value';
    result = replacer.replace('@@key');
    test.equal(expect, result, 'should read from json and replace simple key with value');

    test.done();

  },

  yaml: function (test) {

    var replacer;
    var expect;
    var result;

    test.expect(1);

    replacer = new Applause({
      patterns: [
        {
          yaml: 'key: value'
        }
      ]
    });
    expect = 'value';
    result = replacer.replace('@@key');
    test.equal(expect, result, 'should read from yaml and replace simple key with value');

    test.done();

  }

};

*/
