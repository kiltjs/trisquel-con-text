/* global describe, it */

var evalExpression = require('../eval'),
    assert = require('assert');

describe('eval no filters', function () {

  var getFooBar = evalExpression('foo.bar');

  it('get foobar', function () {

    assert.deepEqual( getFooBar({ foo: { bar: 'foobar' } }), 'foobar' );

  });

  it('ReferenceError €', function () {

    assert.strictEqual( evalExpression(' symbol || \'€\' ')(), '€' );

  });

});

describe('eval errors', function () {

  it('throws Error', function () {

    assert.throws(function() { evalExpression(15); }, Error, 'Number');
    assert.throws(function() { evalExpression([]); }, Error, 'Array');
    assert.throws(function() { evalExpression(null); }, Error, 'null');

  });

  it('throws TypeError', function () {

    assert.throws(function() { evalExpression(15); }, TypeError, 'Number');
    assert.throws(function() { evalExpression([]); }, TypeError, 'Array');
    assert.throws(function() { evalExpression(null); }, TypeError, 'null');

  });

  it('err.message', function () {

    assert.throws(function() { evalExpression(15); }, /expression should be a String/, 'Number');
    assert.throws(function() { evalExpression([]); }, /expression should be a String/, 'Array');
    assert.throws(function() { evalExpression(null); }, /expression should be a String/, 'null');

  });

});

describe('globals triggering errors', function () {

  it('no globals', function () {

    var processExpression = evalExpression(' parseInt(\'32.5\') ', undefined);

    assert.throws(function() { processExpression({}); }, TypeError, 'Number');

    assert.strictEqual( processExpression({ parseInt: parseInt }), 32 );

  });

  it('using globals', function () {

    var processExpression = evalExpression(' parseInt(\'32.5\') ', undefined, { globals: ['parseInt'] });

    assert.strictEqual( processExpression({}), 32 );

  });

});
