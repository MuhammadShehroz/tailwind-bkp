import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Interactor as Pikaday } from 'ember-pikaday/test-support';
import { selectChoose } from 'ember-power-select/test-support/helpers';
import { run } from '@ember/runloop';
import currenciesService from '../../helpers/currencies-service';

module('Integration | Component | receive-payment', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    window.BSN = { document: { terms: null } };
    this.store = this.owner.lookup('service:store');
    this.owner.register(
      'service:currencies',
      currenciesService([{ symbol: '$', code: 'USD' }])
    );
  });

  test('it builds a payment', async function (assert) {
    let invoice, date;
    assert.expect(2);

    date = new Date('2018-03-15');

    this.set('accept', (payment) => {
      assert.deepEqual(payment.getProperties('amount', 'medium', 'reference'), {
        amount: 123.34,
        medium: 'Check',
        reference: '0987'
      });
    });

    run(() => (invoice = this.store.createRecord('invoice')));

    this.set('invoice', invoice);
    await render(hbs`
      <div class='document details'>
        {{receive-payment invoice accept=(action accept)}}
      </div>
    `);

    assert.dom('h2').hasText('Receive Payment');

    await fillIn('.payment-amount input', 123.34);
    await click('.payment-date input');
    await Pikaday.selectDate(date);
    await selectChoose('.select-field', 'Check');
    await fillIn('.payment-reference input', '0987');
    await click('.btn-commit');
  });

  test('it cancels', async function (assert) {
    let invoice;
    assert.expect(2);

    this.set('cancel', () => {
      assert.ok(true, 'cancel');
    });

    run(() => (invoice = this.store.createRecord('invoice')));

    this.set('invoice', invoice);

    await render(hbs`
      <div class='document details'>
        {{receive-payment invoice cancel=(action cancel)}}
      </div>
    `);

    assert.dom('h2').hasText('Receive Payment');

    await click('.btn-cancel');
  });
});
