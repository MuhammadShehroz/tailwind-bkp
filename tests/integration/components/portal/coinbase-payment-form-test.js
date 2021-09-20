import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | portal/coinbase-payment-form',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`<Portal::CoinbasePaymentForm />`);

      assert.equal(this.element.textContent.trim(), '');

      // Template block usage:
      await render(hbs`
      <Portal::CoinbasePaymentForm>
        template block text
      </Portal::CoinbasePaymentForm>
    `);

      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  }
);
