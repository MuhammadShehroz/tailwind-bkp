import { customHtmlSanitize } from 'frontend/helpers/custom-html-sanitize';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Helper | custom-html-sanitize', function (hooks) {
  setupTest(hooks);

  test('it formats a simple string', function (assert) {
    let result = customHtmlSanitize(['this is a string']).toString();
    assert.equal(result, '<p>this is a string</p>');
  });

  test('it converts newlines \n to html breaks', function (assert) {
    let result = customHtmlSanitize(['this is\na string']).toString();
    assert.equal(result, '<p>this is<br/>a string</p>');
  });

  test('it converts two consecutive newlines \n\n to html paragraphs', function (assert) {
    let result = customHtmlSanitize(['this is \n\n a string']).toString();
    assert.equal(result, '<p>this is </p><p> a string</p>');
  });

  test('it converts multiple consecutive newlines \n\n\n properly', function (assert) {
    let result = customHtmlSanitize(['this is\n\n\na string']).toString();
    assert.equal(result, '<p>this is</p><p><br/>a string</p>');
  });

  test('it allow permitted html tags', function (assert) {
    let result = customHtmlSanitize([
      'this <em class="test">is <strong>a</strong></em> string'
    ]).toString();
    assert.equal(
      result,
      '<p>this <em class="test">is <strong>a</strong></em> string</p>'
    );
  });

  test('it sanitizes unpermitted html tags', function (assert) {
    let result = customHtmlSanitize([
      'Ben <div class="dover">Dover</div>'
    ]).toString();
    assert.equal(result, '<p>Ben Dover</p>');
  });
});
