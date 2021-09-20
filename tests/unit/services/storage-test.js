import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | storage', function (hooks) {
  setupTest(hooks);

  test('it works', function (assert) {
    let service = this.owner.lookup('service:storage');
    assert.equal(
      service.keyFor('myKey', 'account.name'),
      'account.name__myKey'
    );
  });
});
