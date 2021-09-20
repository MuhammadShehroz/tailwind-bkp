import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Interactor as Pikaday } from 'ember-pikaday/test-support';
import { selectChoose } from 'ember-power-select/test-support/helpers';
import EmberObject from '@ember/object';
import clientsService from '../../helpers/clients-service';
import currenciesService from '../../helpers/currencies-service';
import Filters from 'frontend/models/filters';
const OrganizationService = EmberObject.extend({
  current: EmberObject.create({
    jsDateFormat: 'MMM D, YYYY'
  })
});

module('Integration | Component | invoice-filters', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:currencies',
      currenciesService([
        { symbol: '$', code: 'USD', name: 'United States Dollar' }
      ])
    );
    this.owner.register(
      'service:clients',
      clientsService([{ name: 'Acme Inc.', id: 42 }])
    );
    this.owner.register('service:organization', OrganizationService);
  });

  test('it changes filters', async function (assert) {
    assert.expect(9);

    let filters = Filters.create({
      source: EmberObject.create({
        after: new Date('2018-03-01'),
        before: new Date('2018-03-31')
      })
    });

    this.set('filters', filters);

    this.set('apply', (f) => {
      // assert.equal(f.get('after'), '2018-03-15');
      assert.equal(f.get('clientId'), 42);
      assert.equal(f.get('currency'), 'USD');

      filters.setProperties(f.expand());
    });

    this.set('reset', function () {
      assert.ok(true, 'reset');
    });

    await render(
      hbs`{{invoice-filters filters=filters apply=(action apply) reset=(action reset)}}`
    );

    assert.dom('.client-summary').hasText('All Clients');
    // assert.dom('.date-summary').hasText('From Mar 1, 2018 to Mar 31, 2018');
    assert.dom('.status-summary').hasText('All Types');
    assert.dom('.currency-summary').hasText('All Currencies');

    await click('.toggler a');

    await click('.start-date input');
    await Pikaday.selectDate(new Date('2018-03-15'));

    await selectChoose('.client-select-field', 'Acme Inc.');
    await selectChoose('.currency-select-field', 'United States Dollar');

    await click('.apply');

    assert.dom('.client-summary').hasText('Acme Inc.');
    assert.dom('.status-summary').hasText('All Types');
    assert.dom('.currency-summary').hasText('United States Dollar');

    await click('.toggler a');
    await click('.reset');
  });
});
