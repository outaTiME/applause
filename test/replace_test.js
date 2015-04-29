
/*
 * applause
 *
 * Copyright (c) 2015 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/applause/blob/master/LICENSE-MIT
 */

'use strict';

// dependencies

var assert = require('assert');
var Applause = require('../src/applause');

// test

describe('core', function () {

  var applause;
  var expect;
  var result;
  var json_test = {
    "key_1": "value_1",
    "key_2": "value_2",
    "group_1": {
      "group_2": {
        "key_3": "value_3"
      },
      "group_3": {
        "key_4": "value_4"
      },
      "array": [
        1,
        2,
        3
      ]
    }
  };

  it('should replace simple key with value', function (done) {

    applause = Applause.create({
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

  it('should replace simple key with value and return the details', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key',
          replacement: 'value'
        }
      ],
      includeDetails: true
    });
    expect = 'value';
    result = applause.replace('@@key');
    assert.equal(result.result, expect);
    assert.equal(result.details.length, 1);
    done();

  });

  it('should replace simple key with value (replacement alternative)', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key',
          replace: 'value'
        }
      ]
    });
    expect = 'value';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should replace simple key with value using custom prefix', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key',
          replacement: 'value'
        }
      ],
      prefix: '@replace:'
    });
    expect = 'value';
    result = applause.replace('@replace:key');
    assert.equal(result, expect);
    done();

  });

  it('should replace simple key with value without prefix', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key',
          replacement: 'value'
        }
      ],
      usePrefix: false
    });
    expect = 'value';
    result = applause.replace('key');
    assert.equal(result, expect);
    done();

  });


  it('should replace multiple key-value pairs', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key-1',
          replacement: 'value-1'
        },
        {
          match: 'key-2',
          replacement: 'value-2'
        }
      ]
    });
    expect = 'value-1,value-2';
    result = applause.replace('@@key-1,@@key-2');
    assert.equal(result, expect);
    done();

  });

  it('should replace multiple key-value pairs and return the details', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key-1',
          replacement: 'value-1'
        },
        {
          match: 'key-2',
          replacement: 'value-2'
        }
      ],
      includeDetails: true
    });
    expect = 'value-1,value-2';
    result = applause.replace('@@key-1,@@key-2');
    assert.equal(result.result, expect);
    assert.equal(result.details.length, 2);
    done();

  });

  it('should escape the dollar sign ($)', function (done) {

    applause = Applause.create({
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

  it('should use special characters in replacement', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key',
          replacement: 'detta är en sträng'
        }
      ]
    });
    expect = 'detta är en sträng';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should use regexp for matching', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: /key/g,
          replacement: 'value'
        }
      ]
    });
    expect = 'value';
    result = applause.replace('key');
    assert.equal(result, expect);
    done();

  });

  it('should use function for replacements', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key',
          replacement: function () {
            return 'value';
          }
        }
      ]
    });
    expect = 'value';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should replace "John Smith" for "Smith, John"', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: /(\w+)\s(\w+)/,
          replacement: '$2, $1'
        }
      ]
    });
    expect = 'Smith, John';
    result = applause.replace('John Smith');
    assert.equal(result, expect);
    done();

  });

  it('should throw error when invalid match type found', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 1,
          replacement: 'value'
        }
      ]
    });
    assert.throws(
      function () {
        applause.replace('@@1');
      },
      Error
    );
    done();

  });

  it('should throw error when match attribute was undefined', function (done) {

    applause = Applause.create({
      patterns: [
        {
          replacement: 'value'
        }
      ]
    });
    assert.throws(
      function () {
        applause.replace('@@key');
      },
      Error
    );
    done();

  });

  it('should throw error when match attribute was null', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: null,
          replacement: 'value'
        }
      ]
    });
    assert.throws(
      function () {
        applause.replace('@@key');
      },
      Error
    );
    done();

  });

  it('should throw error when replacement attribute was undefined', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key'
        }
      ]
    });
    assert.throws(
      function () {
        applause.replace('@@key');
      },
      Error
    );
    done();

  });

  it('should throw error when replacement attribute was null', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key',
          replacement: null
        }
      ]
    });
    assert.throws(
      function () {
        applause.replace('@@key');
      },
      Error
    );
    done();

  });

  it('should ignore empty patterns definitions', function (done) {

    applause = Applause.create({
      patterns: [
        {
          // pass
        }
      ]
    });
    expect = false;
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should not match any pattern definition', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key',
          replacement: 'value'
        }
      ]
    });
    expect = false;
    result = applause.replace();
    assert.equal(result, expect);
    done();

  });

  it('should replace patterns using plain objects', function (done) {

    applause = Applause.create({
      variables: {
        key: 'value'
      }
    });
    expect = 'value';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should replace simple key with array object representation', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key',
          replacement: [1, 2, 3, 4]
        }
      ]
    });
    expect = '[1,2,3,4]';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should replace simple key with plain object representation', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key',
          replacement: {
            foo: 'bar'
          }
        }
      ]
    });
    expect = '{"foo":"bar"}';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should sort patterns to prevent bad replaces', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'smaller',
          replacement: '2'
        },
        {
          match: 'small',
          replacement: '1'
        },
        {
          match: 'smallest',
          replacement: '3'
        }
      ]
    });
    expect = '1-2-3';
    result = applause.replace('@@small-@@smaller-@@smallest');
    assert.equal(result, expect);
    done();

  });

  it('should sort the json patterns to prevent bad replaces', function (done) {

    applause = Applause.create({
      patterns: [
        {
          json: {
            "small": "1",
            "smaller": "2",
            "smallest": "3"
          }
        }
      ]
    });
    expect = '1-2-3';
    result = applause.replace('@@small-@@smaller-@@smallest');
    assert.equal(result, expect);
    done();

  });

  it('should replace simple key with value but preserve prefix', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key',
          replacement: 'value'
        }
      ],
      preservePrefix: true
    });
    expect = '@@value';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should replace simple key with value and not preserve prefix (function as replacement)', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: 'key',
          replacement: function () {
            return 'value';
          }
        }
      ],
      preservePrefix: true
    });
    expect = 'value';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should replace simple key with value and not preserve prefix (regexp as match)', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: /@@key/g,
          replacement: 'value'
        }
      ],
      preservePrefix: true
    });
    expect = 'value';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should flatten json object', function (done) {

    applause = Applause.create({
      patterns: [
        {
          json: json_test
        }
      ]
    });
    expect = 'value_3';
    result = applause.replace('@@group_1.group_2.key_3');
    assert.equal(result, expect);
    done();

  });

  it('should flatten json object with custom delimiter', function (done) {

    applause = Applause.create({
      patterns: [
        {
          json: json_test
        }
      ],
      delimiter: '-'
    });
    expect = 'value_3';
    result = applause.replace('@@group_1-group_2-key_3');
    assert.equal(result, expect);
    done();

  });


  it('should escape string to create an regexp', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: '(../fonts/',
          replacement: '../font/'
        }
      ],
      usePrefix: false
    });
    expect = '../font/';
    result = applause.replace('(../fonts/');
    assert.equal(result, expect);
    done();

  });

  it('should escape special characters in replacement', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: '$var',
          replacement: '$var-value'
        },
        {
          match: '@var',
          replacement: '@var-value'
        }
      ],
      usePrefix: false
    });
    expect = [
      '$var-value',
      '@var-value',
    ].join();
    result = applause.replace([
      '$var',
      '@var',
      ].join());
    assert.equal(result, expect);
    done();

  });

  it('should escape special characters in replacement (function as replacement)', function (done) {

    applause = Applause.create({
      patterns: [
        {
          match: '$var-fn',
          replacement: function () {
            return '$var-fn-value';
          }
        },
        {
          match: '@var-fn',
          replacement: function () {
            return '@var-fn-value';
          }
        }
      ],
      usePrefix: false
    });
    expect = [
      '$var-fn-value',
      '@var-fn-value'
    ].join();
    result = applause.replace([
      '$var-fn',
      '@var-fn',
      ].join());
    assert.equal(result, expect);
    done();

  });

});

describe('plugins', function () {

  var applause;
  var expect;
  var result;

  it('should read from json and replace simple key with value', function (done) {

    applause = Applause.create({
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

  it('should read from deferrer json and replace simple key with value', function (done) {

    applause = Applause.create({
      patterns: [
        {
          json: function (done) {
            done({
              key: 'value'
            });
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

    applause = Applause.create({
      patterns: [
        {
          yaml: 'key: value'
        }
      ]
    });
    expect = 'value';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should read from deferrer yaml and replace simple key with value', function (done) {

    applause = Applause.create({
      patterns: [
        {
          yaml: function (done) {
            done('key: value');
          }
        }
      ]
    });
    expect = 'value';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should read from cson and replace simple key with value', function (done) {

    applause = Applause.create({
      patterns: [
        {
          cson: 'key: \'value\''
        }
      ]
    });
    expect = 'value';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

  it('should read from deferrer cson and replace simple key with value', function (done) {

    applause = Applause.create({
      patterns: [
        {
          cson: function (done) {
            done('key: \'value\'');
          }
        }
      ]
    });
    expect = 'value';
    result = applause.replace('@@key');
    assert.equal(result, expect);
    done();

  });

});
