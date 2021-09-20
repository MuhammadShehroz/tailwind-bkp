import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | clients/index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:clients/index');
    assert.ok(controller);
  });
});
