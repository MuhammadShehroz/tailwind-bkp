import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, typeIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-elements/email-input', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders email input field', async function (assert) {
    this.set('value', '');

    await render(hbs`
      <FormElements::EmailInput
        @value={{value}}
      />
    `);
    assert.dom('input[type="email"]').exists();
    await typeIn('input[type="email"]', ' fillin@email.com ');
    assert.equal(
      this.value,
      'fillin@email.com',
      'Trim spaces from filled value'
    );
  });
});
