import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import currenciesService from '../../helpers/currencies-service';
import EmberObject from '@ember/object';
const OrganizationService = EmberObject.extend({
  current: EmberObject.create({
    currencyFormat: 'symbol_first_space'
  })
});

module('Integration | Component | format-currency', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:currencies',
      currenciesService([{ symbol: '$', code: 'USD' }])
    );
    this.owner.register('service:organization', OrganizationService);
  });

  test('formats currency', async function (assert) {
    let value = 3250.7569;
    this.set('value', value);

    await render(hbs`{{format-currency value=value isoCode='USD'}}`);

    assert.dom(this.element).hasText('$ 3,250.76');
  });
});
