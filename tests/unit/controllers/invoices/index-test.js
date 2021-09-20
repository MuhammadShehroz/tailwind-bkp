import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | invoices/index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:invoices/index');
    assert.ok(controller);
  });
});
