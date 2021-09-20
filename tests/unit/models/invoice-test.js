import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | invoice', function (hooks) {
  setupTest(hooks);

  test('calculations: net-terms', function (assert) {
    let invoice;

    run(() => {
      invoice = this.owner.lookup('service:store').createRecord('invoice');
    });

    assert.equal(invoice.get('netTerms'), null, 'netTerms empty');
  });
});
