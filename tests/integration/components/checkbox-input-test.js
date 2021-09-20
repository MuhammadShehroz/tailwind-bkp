import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | checkbox-input', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders label, error message, and switch the checkbox', async function (assert) {
    this.set('errorMessage', 'Not available');
    this.set('model', { includeStripe: false });

    await render(hbs`
      <CheckboxInput
        @value='model.includeStripe'
        @label='Checkbox label'
      />
    `);
    assert.dom('.tw-checkbox label').exists();
    assert.dom('.tw-checkbox label').hasText('Checkbox label');

    assert.dom('.validation-message').doesNotExist();
    await render(hbs`
      <CheckboxInput
        @value={{model.includeStripe}}
        @label='Checkbox label'
        @showErrors={{true}}
        @errorMessage={{errorMessage}}
      />
    `);
    assert.dom('.validation-message').exists();
    assert.dom('.validation-message').hasText('Not available');

    await click('.tw-checkbox .tw-label');
    assert.equal(this.model.includeStripe, true, 'Checkbox is checked on');
  });
});
