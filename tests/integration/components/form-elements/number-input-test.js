import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, typeIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | form-elements/number-input',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders number input field', async function (assert) {
      this.set('value', 0);

      await render(hbs`
      <FormElements::NumberInput
        @value={{value}}
      />
    `);
      assert.dom('.tw-number-input').exists();
      assert.dom('.tw-number-input[type="number"]').exists();
      assert.equal(this.value, 0, 'Default value');
      await typeIn('.tw-number-input', '1');
      assert.equal(this.value, 1, 'New value');
    });
  }
);
