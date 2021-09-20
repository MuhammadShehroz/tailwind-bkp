import ValidationError from 'frontend/utils/errors/validation-error';
import { module, test } from 'qunit';

module('Unit | Utility | errors/validation-error', function () {
  test('it works', function (assert) {
    let result = new ValidationError([]);
    assert.ok(result);
  });

  test('error message should contains all errors concatenated', function (assert) {
    let result = new ValidationError([
      { message: 'error one' },
      { message: 'error two' }
    ]);
    assert.equal(result.message, 'error one<br/>error two');
  });
});
