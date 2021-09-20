import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-elements/select-menu', function (hooks) {
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
      <FormElements::SelectMenu
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
    assert.dom('button').exists();
    assert.dom('button').hasText(this.valueLabel);
    assert.dom('.validation-message').exists();
    assert.dom('.validation-message').hasText(this.errorMessage);
    assert.equal(this.value, 'cad', 'default value');
    assert.dom('.validation-message').exists();
    assert.dom('.tw-select-item:nth-child(3)').hasText(this.valueLabel);
    await click('.tw-select-button');
    await click('.tw-select-item:nth-child(4)');
    assert.equal(this.value, this.currencies[3].id, 'selected value');
  });
});
