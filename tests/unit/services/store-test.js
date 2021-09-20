import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | store', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:store');
    assert.ok(service);
  });
});
