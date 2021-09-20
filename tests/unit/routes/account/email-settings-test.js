import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | account/email-settings', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:account/email-settings');
    assert.ok(route);
  });
});
