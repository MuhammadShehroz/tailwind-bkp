import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | paypal-payment', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:paypal-payment');
    assert.ok(route);
  });
});
