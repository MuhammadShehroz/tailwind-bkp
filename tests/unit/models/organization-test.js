import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | organization', function (hooks) {
  setupTest(hooks);
  hooks.beforeEach(function () {
    window.BSN = {
      organization: { dateFormats: [] },
      document: { taxDistributions: [] }
    };
  });

  test('it exists', function (assert) {
    let model = this.owner.lookup('service:store').createRecord('organization');
    assert.ok(!!model);
  });

  test('set up default brand colors', function (assert) {
    let model = this.owner.lookup('service:store').createRecord('organization');
    assert.equal(model.get('buttonColor'), '#1173E6', 'Default button color');
    assert.equal(model.get('headerColor'), '#354656', 'Default header color');
  });
});
