import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | estimates/preview', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:estimates/preview');
    assert.ok(controller);
  });
});
