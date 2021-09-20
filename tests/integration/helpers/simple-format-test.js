import { simpleFormat } from 'frontend/helpers/simple-format';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Helper | simple-format', function (hooks) {
  setupTest(hooks);

  test('it formats a simple string', function (assert) {
    let result = simpleFormat(['this is a string']).toString();
    assert.equal(result, '<p>this is a string</p>');
  });

  test('it converts newlines \n to html breaks', function (assert) {
    let result = simpleFormat(['this is\na string']).toString();
    assert.equal(result, '<p>this is<br/>a string</p>');
  });

  test('it converts two consecutive newlines \n\n to html paragraphs', function (assert) {
    let result = simpleFormat(['this is \n\n a string']).toString();
    assert.equal(result, '<p>this is </p><p> a string</p>');
  });

  test('it converts multiple consecutive newlines \n\n\n properly', function (assert) {
    let result = simpleFormat(['this is\n\n\na string']).toString();
    assert.equal(result, '<p>this is</p><p><br/>a string</p>');
  });

  test('it sanitizes html tags <em></em>', function (assert) {
    let result = simpleFormat(['this <em>is a</em> string']).toString();
    assert.equal(result, '<p>this &lt;em&gt;is a&lt;/em&gt; string</p>');
  });

  test('it handles empty strings', function (assert) {
    let result = simpleFormat(['']).toString();
    assert.equal(result, '');
  });

  test('it handles null', function (assert) {
    let result = simpleFormat([null]).toString();
    assert.equal(result, '');
  });

  test('it handles undefined', function (assert) {
    let result = simpleFormat([undefined]).toString();
    assert.equal(result, '');
  });
});
