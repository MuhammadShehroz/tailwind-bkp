import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | invoices/settings', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:invoices/settings');
    assert.ok(route);
  });
});
