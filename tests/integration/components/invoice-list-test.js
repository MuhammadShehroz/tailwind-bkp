import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import currenciesService from '../../helpers/currencies-service';
import EmberObject from '@ember/object';
const OrganizationService = EmberObject.extend({
  current: EmberObject.create({
    jsDateFormat: 'MMM D, YYYY',
    currencyFormat: 'symbol_first'
  })
});

module('Integration | Component | invoice-list', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:currencies',
      currenciesService([{ symbol: '$', code: 'USD' }])
    );
    this.owner.register('service:organization', OrganizationService);
  });

  test('it renders', async function (assert) {
    let model = [
      {
        identifier: 'INV-1',
        client: { id: 1, name: 'Acme Inc.' },
        issuedOn: '2018-03-01',
        dueOn: '2018-03-15',
        cachedTotal: 120,
        currency: 'USD',
        hasPaid: true,
        cachedTotalPaid: 100,
        cachedTotalDue: 20
      }
    ];
    let summaryPerQuery = [
      {
        total: 120,
        // eslint-disable-next-line camelcase
        total_due: 20,
        // eslint-disable-next-line camelcase
        total_paid: 100,
        currency: 'USD'
      }
    ];

    this.set('model', model);
    this.set('summaryPerQuery', summaryPerQuery);
    this.set('hasPages', false);

    await render(
      hbs`{{invoice-list model=model order=order sort=sort summaryPerQuery=summaryPerQuery hasPages=hasPages}}`
    );

    assert.deepEqual(
      findAll('.listing-header a').map((a) => a.textContent),
      ['ID', 'Client', 'Issued', 'Due', 'Total']
    );

    let tr = [
      '.record-row .identifier a.record-id',
      '.record-row .client .name',
      '.record-row .issue-date .date',
      '.record-row .due-date .date',
      '.record-row .amounts .total',
      '.record-row .amounts .paid',
      '.record-row .amounts .due'
    ].map((s) => find(s).textContent.trim());

    assert.deepEqual(tr, [
      'INV-1',
      'Acme Inc.',
      'Mar 1, 2018',
      'Mar 15, 2018',
      '$120.00',
      'Paid: -$100.00',
      'Due: $20.00'
    ]);

    let querySummary = [
      '.summary.overall .total',
      '.summary.overall .amounts .total',
      '.summary.overall .amounts .paid',
      '.summary.overall .amounts .due'
    ].map((s) => find(s).textContent.trim());

    assert.deepEqual(querySummary, ['Total', '$120.00', '$100.00', '$20.00']);

    await render(
      hbs`{{invoice-list model=model order=order sort=sort summaryPerQuery=summaryPerQuery hasPages='true'}}`
    );

    querySummary = [
      '.summary.overall .total',
      '.summary.overall .amounts .total',
      '.summary.overall .amounts .paid',
      '.summary.overall .amounts .due'
    ].map((s) => find(s).textContent.trim());

    assert.deepEqual(querySummary, [
      'Total (all pages)',
      '$120.00',
      '$100.00',
      '$20.00'
    ]);
  });
});
