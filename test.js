var test = require('ava');
var Applause = require('.');

test('should replace simple key with value', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: 'value'
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
});

test('should replace simple key with empty value', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: ''
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, '');
});

test('should replace simple key with value and return the detail', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: 'value'
      }
    ],
    detail: true
  });
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
  t.is(result.detail.length, 1);
});

test('should replace simple key with value (replacement alternative)', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replace: 'value'
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
});

test('should replace simple key with value using custom prefix', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: 'value'
      }
    ],
    prefix: '@replace:'
  });
  var result = applause.replace('@replace:key');
  t.is(result.content, 'value');
});

test('should replace simple key with value without prefix', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: 'value'
      }
    ],
    usePrefix: false
  });
  var result = applause.replace('key');
  t.is(result.content, 'value');
});

test('should replace multiple key-value pairs', function (t) {
  var applause = Applause.create({
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
  var result = applause.replace('@@key-1,@@key-2');
  t.is(result.content, 'value-1,value-2');
});

test('should replace multiple key-value pairs and return the detail', function (t) {
  var applause = Applause.create({
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
    detail: true
  });
  var result = applause.replace('@@key-1,@@key-2');
  t.is(result.content, 'value-1,value-2');
  t.is(result.detail.length, 2);
});

test('should not escape dollar sequence when use simple key', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: '$'
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, '$');
});

test('should escape dollar sequence when use regexp for matching', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: /key/g,
        replacement: '$$'
      }
    ]
  });
  var result = applause.replace('key');
  t.is(result.content, '$');
});

test('should use special characters in replacement', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: 'detta är en sträng'
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, 'detta är en sträng');
});

test('should use regexp for matching', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: /key/g,
        replacement: 'value'
      }
    ]
  });
  var result = applause.replace('key');
  t.is(result.content, 'value');
});

test('should use function for replacements', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: function () {
          return 'value';
        }
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
});

test('should replace "John Smith" for "Smith, John"', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: /(\w+)\s(\w+)/,
        replacement: '$2, $1'
      }
    ]
  });
  var result = applause.replace('John Smith');
  t.is(result.content, 'Smith, John');
});

test('should throw error when invalid match type found', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 1,
        replacement: 'value'
      }
    ]
  });
  t.throws(function () {
    applause.replace('@@1');
  });
});

test('should throw error when match attribute is undefined', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        replacement: 'value'
      }
    ]
  });
  t.throws(function () {
    applause.replace('@@key');
  });
});

test('should throw error when match attribute is null', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: null,
        replacement: 'value'
      }
    ]
  });
  t.throws(function () {
    applause.replace('@@key');
  });
});

test('should throw error when replacement attribute is undefined', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key'
      }
    ]
  });
  t.throws(function () {
    applause.replace('@@key');
  });
});

test('should throw error when replacement attribute is null', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: null
      }
    ]
  });
  t.throws(function () {
    applause.replace('@@key');
  });
});

test('should ignore empty patterns definitions', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        // Pass
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, false);
});

test('should not match any pattern definition', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: 'value'
      }
    ]
  });
  var result = applause.replace();
  t.is(result.content, false);
});

test('should ignore non-string data types', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: 'value'
      }
    ]
  });
  var booleanResult = applause.replace(true);
  t.is(booleanResult.content, false);
  var numberResult = applause.replace(404);
  t.is(numberResult.content, false);
});

test('should replace patterns using plain objects', function (t) {
  var applause = Applause.create({
    variables: {
      key: 'value'
    }
  });
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
});

test('should replace simple key with array object representation', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: [1, 2, 3, 4]
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, '[1,2,3,4]');
});

test('should replace simple key with plain object representation', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: {
          foo: 'bar'
        }
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, '{"foo":"bar"}');
});

test('should sort patterns to prevent bad replaces', function (t) {
  var applause = Applause.create({
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
  var result = applause.replace('@@small-@@smaller-@@smallest');
  t.is(result.content, '1-2-3');
});

test('should replace simple key with value and preserve prefix', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: 'value'
      }
    ],
    preservePrefix: true
  });
  var result = applause.replace('@@key');
  t.is(result.content, '@@value');
});

test('should replace simple key with array object representation and preserve prefix', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: 'key',
        replacement: [1, 2, 3, 4]
      }
    ],
    preservePrefix: true
  });
  var result = applause.replace('@@key');
  t.is(result.content, '@@[1,2,3,4]');
});

test('should replace simple key with value and not preserve prefix (function as replacement)', function (t) {
  var applause = Applause.create({
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
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
});

test('should replace simple key with value and not preserve prefix (regexp as match)', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: /@@key/g,
        replacement: 'value'
      }
    ],
    preservePrefix: true
  });
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
});

test('should escape string to create an regexp', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        match: '(../fonts/',
        replacement: '../font/'
      }
    ],
    usePrefix: false
  });
  var result = applause.replace('(../fonts/');
  t.is(result.content, '../font/');
});

test('should escape special characters in replacement', function (t) {
  var applause = Applause.create({
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
  var result = applause.replace([
    '$var',
    '@var'
  ].join());
  t.is(result.content, [
    '$var-value',
    '@var-value'
  ].join());
});

test('should escape special characters in replacement (function as replacement)', function (t) {
  var applause = Applause.create({
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
  var result = applause.replace([
    '$var-fn',
    '@var-fn'
  ].join());
  t.is(result.content, [
    '$var-fn-value',
    '@var-fn-value'
  ].join());
});

test('should check version number', function (t) {
  t.truthy(Applause.version);
});

// Plugins

// JSON

test('should read from json and replace simple key with value', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        json: {
          key: 'value'
        }
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
});

test('should read from json and replace simple key with value (escape dollar sequence)', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        json: {
          API_KEY: '12213lkhgjhvj$$bvhmvff@sdfertvc'
        }
      }
    ]
  });
  var result = applause.replace('@@API_KEY');
  t.is(result.content, '12213lkhgjhvj$$bvhmvff@sdfertvc');
});

test('should read from deferrer json and replace simple key with value', function (t) {
  var applause = Applause.create({
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
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
});

test('should sort the json patterns to prevent bad replaces', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        json: {
          small: '1',
          smaller: '2',
          smallest: '3'
        }
      }
    ]
  });
  var result = applause.replace('@@small-@@smaller-@@smallest');
  t.is(result.content, '1-2-3');
});

// Flatten

var jsonFixture = {
  key1: 'value1',
  key2: 'value2',
  group1: {
    group2: {
      key3: 'value3'
    },
    group3: {
      key4: 'value4'
    },
    array: [1, 2, 3]
  }
};

test('should flatten json object', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        json: jsonFixture
      }
    ]
  });
  var result = applause.replace('@@group1.group2.key3');
  t.is(result.content, 'value3');
});

test('should flatten json object with custom delimiter', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        json: jsonFixture
      }
    ],
    delimiter: '-'
  });
  var result = applause.replace('@@group1-group2-key3');
  t.is(result.content, 'value3');
});

test('should replace simple key from json with plain object representation', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        json: jsonFixture
      }
    ]
  });
  var result = applause.replace('@@group1.group2');
  t.is(result.content, '{"key3":"value3"}');
});

test('should replace simple key from json with plain object representation and preserve prefix', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        json: jsonFixture
      }
    ],
    preservePrefix: true
  });
  var result = applause.replace('@@group1.group2');
  t.is(result.content, '@@{"key3":"value3"}');
});

// YAML

test('should read from yaml and replace simple key with value', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        yaml: 'key: "value"'
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
});

test('should read from yaml and replace simple key with value (escape dollar sequence)', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        yaml: 'API_KEY: "12213lkhgjhvj$$bvhmvff@sdfertvc"'
      }
    ]
  });
  var result = applause.replace('@@API_KEY');
  t.is(result.content, '12213lkhgjhvj$$bvhmvff@sdfertvc');
});

test('should read from deferrer yaml and replace simple key with value', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        yaml: function (done) {
          done('key: "value"');
        }
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
});

test('should sort the yaml patterns to prevent bad replaces', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        yaml: 'small: "1"\nsmaller: "2"\nsmallest: "3"'
      }
    ]
  });
  var result = applause.replace('@@small-@@smaller-@@smallest');
  t.is(result.content, '1-2-3');
});

// CSON

test('should read from cson and replace simple key with value', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        cson: 'key: "value"'
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
});

test('should read from cson and replace simple key with value (escape dollar sequence)', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        cson: 'API_KEY: "12213lkhgjhvj$$bvhmvff@sdfertvc"'
      }
    ]
  });
  var result = applause.replace('@@API_KEY');
  t.is(result.content, '12213lkhgjhvj$$bvhmvff@sdfertvc');
});

test('should read from deferrer cson and replace simple key with value', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        cson: function (done) {
          done('key: "value"');
        }
      }
    ]
  });
  var result = applause.replace('@@key');
  t.is(result.content, 'value');
});

test('should sort the cson patterns to prevent bad replaces', function (t) {
  var applause = Applause.create({
    patterns: [
      {
        cson: 'small: "1"\nsmaller: "2"\nsmallest: "3"'
      }
    ]
  });
  var result = applause.replace('@@small-@@smaller-@@smallest');
  t.is(result.content, '1-2-3');
});
