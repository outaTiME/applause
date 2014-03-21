
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

  it('should read from json and replace simple key with value', function (done) {

    applause = new Applause({
      patterns: [
        {
          json: {
            key: 'value'
          }
        }
      ]
    });
    expect = 'value';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should read from yaml and replace simple key with value', function (done) {

    applause = new Applause({
      patterns: [
        {
          yaml: 'key: value'
        }
      ]
    });
    expect = 'value';
    result = applause.replace('@@key');
console.log('YAML ',result);    
    assert.equal(result, expect);
    done();

  });

  it('should escape the dollar sign ($)', function (done) {

    applause = new Applause({
      patterns: [
        {
          match: 'key',
          replacement: '$$\''
        }
      ]
    });
    expect = '$\'';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should replace "John Smith" for "Smith, John"', function (done) {

    applause = new Applause({
      patterns: [
        {
          match: /(\w+)\s(\w+)/,
          replacement: '$2, $1',
        }
      ]
    });
    expect = 'Smith, John';
    result = applause.replace('John Smith');
    assert.equal(result, expect);
    done();

  });

});
