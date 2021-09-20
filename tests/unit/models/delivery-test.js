import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | delivery', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let model = this.owner.lookup('service:store').createRecord('delivery');
    assert.ok(!!model);
  });
});
