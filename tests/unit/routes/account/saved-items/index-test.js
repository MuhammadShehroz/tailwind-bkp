import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | account/saved-items/index', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:account/saved-items/index');
    assert.ok(route);
  });
});
