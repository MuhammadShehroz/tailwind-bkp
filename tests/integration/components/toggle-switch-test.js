import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | toggle-switch', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders label, hint, and switch the toggle button', async function (assert) {
    this.set('value', false);

    await render(hbs`<ToggleSwitch @label='On' @hint='hint' />`);
    assert.dom('.ml-3 span').exists();
    assert.dom('.ml-3 span').hasText('On');
    assert.dom('.ml-3 span:nth-child(2)').exists();
    assert.dom('.ml-3 span:nth-child(2)').hasText('hint');

    assert.equal(this.value, false, 'default value');
    await render(hbs`<ToggleSwitch @value={{this.value}} />`);
    await click('.switch-button');
    assert.equal(this.value, true, 'changed successfully');
  });
});
