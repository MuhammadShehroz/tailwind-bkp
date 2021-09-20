import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | estimates/preview', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:estimates/preview');
    assert.ok(route);
  });
});
