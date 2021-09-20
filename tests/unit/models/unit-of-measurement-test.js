import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | unit of measurement', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let model = this.owner
      .lookup('service:store')
      .createRecord('unit-of-measurement');
    assert.ok(!!model);
  });
});
