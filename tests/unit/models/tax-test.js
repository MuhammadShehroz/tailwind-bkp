import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | tax', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let model = this.owner.lookup('service:store').createRecord('tax');
    assert.ok(!!model);
  });
});
