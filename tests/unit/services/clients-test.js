import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | clients', function (hooks) {
  setupTest(hooks);

  let clients = ['acme'];

  test('it queries clients', function (assert) {
    let store = this.owner.lookup('service:store');
    store.setProperties({
      query() {
        return clients;
      }
    });
    let service = this.owner.lookup('service:clients');

    assert.equal(service.query(), clients);
  });
});
