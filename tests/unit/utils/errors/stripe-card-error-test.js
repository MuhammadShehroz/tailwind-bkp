import StripeCardError from 'frontend/utils/errors/stripe-card-error';
import { module, test } from 'qunit';

module('Unit | Utility | errors/stripe-card-error', function () {
  test('it works', function (assert) {
    let result = new StripeCardError();
    assert.ok(result);
  });

  test('custom message', function (assert) {
    let result = new StripeCardError('Wrong card number');
    assert.equal(result.message, 'Wrong card number');
  });
});
