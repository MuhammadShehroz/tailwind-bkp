import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | account/saved-items/new', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:account/saved-items/new');
    assert.ok(route);
  });
});
