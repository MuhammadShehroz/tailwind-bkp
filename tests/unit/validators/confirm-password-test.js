import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validator | confirm-password', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let validator = this.owner.lookup('validator:confirm-password');
    assert.ok(validator);
  });
});
