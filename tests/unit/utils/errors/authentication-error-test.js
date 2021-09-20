import AuthenticationError from 'frontend/utils/errors/authentication-error';
import { module, test } from 'qunit';

module('Unit | Utility | errors/authentication-error', function () {
  test('it works', function (assert) {
    let result = new AuthenticationError();
    assert.ok(result);
  });

  test('default message', function (assert) {
    let result = new AuthenticationError();
    assert.equal(
      result.message,
      'You need to sign in or sign up before continuing.'
    );
  });

  test('custom message', function (assert) {
    let result = new AuthenticationError('Wrong password');
    assert.equal(result.message, 'Wrong password');
  });
});
