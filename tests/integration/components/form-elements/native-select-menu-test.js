import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | form-elements/native-select-menu',
  function (hooks) {
    setupRenderingTest(hooks);
    test('it renders', async function (assert) {
      this.setProperties({
        currencies: [
          { id: 'eur', name: 'Euro' },
          { id: 'usd', name: 'USA Dollar' },
          { id: 'cad', name: 'Canadian Dollar' },
          { id: 'gbp', name: 'Great Britain Pound' },
          { id: 'sfr', name: 'Swiss Franc' }
        ],

        label: 'Currency',
        value: 'cad',
        valueLabel: 'Canadian Dollar',
        errorMessage: 'This value cant be selected on Sunday'
      });

      await render(hbs`
      <FormElements::NativeSelectMenu
        @label={{label}}
        @options={{currencies}}
        @optionKey='id'
        @optionLabel='name'
        @value={{value}}
        @showErrors={{true}}
        @errorMessage={{errorMessage}}
      />
    `);

      assert.dom('label').exists();
      assert.dom('label').hasText(this.label);
      assert.dom('.validation-message').exists();
      assert.dom('.validation-message').hasText(this.errorMessage);
      assert.dom('option').exists({ count: 5 });
      assert.equal(document.querySelector('select').value, this.value);
      this.set('value', null);
      assert.dom('option').exists({ count: 6 });
    });
  }
);
