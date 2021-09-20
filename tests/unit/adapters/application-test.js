import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import PortalService from 'frontend/services/portal';
import OrganizationService from 'frontend/services/organization';
import { authenticateSession } from 'ember-simple-auth/test-support';
import { InvalidError } from '@ember-data/adapter/error';

function setupPortal(adapter) {
  let portal = adapter.get('portal');
  portal.setCredentials('token', 1);
}

module('Unit | Adapter | application', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:portal', PortalService);
    this.owner.register('service:organization', OrganizationService);
  });

  test('namespace', function (assert) {
    assert.expect(2);
    let adapter = this.owner.lookup('adapter:application');
    assert.equal(adapter.get('namespace'), 'api');

    setupPortal(adapter);
    assert.equal(adapter.get('namespace'), 'portal');
  });

  test('pathForType', async function (assert) {
    assert.expect(2);

    await authenticateSession({});

    let adapter = this.owner.lookup('adapter:application');
    adapter.get('organization').setCurrent(42);

    assert.equal(adapter.pathForType('invoice'), '42/invoices');

    setupPortal(adapter);
    assert.equal(adapter.pathForType('invoice'), 'invoices');
  });

  test('handleResponse', async function (assert) {
    let adapter = this.owner.lookup('adapter:application');
    let payload = {
      errors: { file: ['Image size should be less than or equal to 4096x4096'] }
    };
    assert.ok(adapter.handleResponse(422, {}, payload) instanceof InvalidError);
  });
});
