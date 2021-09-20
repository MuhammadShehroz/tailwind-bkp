import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { selectChoose } from 'ember-power-select/test-support';

module(
  'Integration | Component | form-elements/power-select-menu',
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
        value: { id: 'cad', name: 'Canadian Dollar' },
        valueLabel: 'Canadian Dollar',
        errorMessage: 'This value cant be selected on Sunday'
      });

      await render(hbs`
      <FormElements::PowerSelectMenu
        @label={{label}}
        @options={{currencies}}
        @optionKey='id'
        @optionLabel='name'
        @value={{value}}
        @searchEnabled={{true}}
        @showErrors={{true}}
        @errorMessage={{errorMessage}}
      />
    `);

      assert.dom('label').exists();
      assert.dom('label').hasText(this.label);
      assert.dom('.validation-message').exists();
      assert.dom('.validation-message').hasText(this.errorMessage);
      assert.dom('.ember-power-select-trigger').hasText(this.value.name);
      assert.dom('.validation-message').exists();
      await click('.ember-power-select-trigger');
      assert
        .dom('.ember-power-select-option:nth-child(3)')
        .hasText(this.value.name);
      assert.dom('.ember-power-select-dropdown').exists();
      assert.dom('.ember-power-select-option').exists({ count: 5 });
      selectChoose('.ember-power-select-trigger', 'Swiss Franc');
      assert.dom('.ember-power-select-trigger').hasText(this.value.name);
    });
  }
);
