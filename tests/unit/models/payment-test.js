import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | payment', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let model = this.owner.lookup('service:store').createRecord('payment');
    assert.ok(!!model);
  });
});
