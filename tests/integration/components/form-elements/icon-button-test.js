import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-elements/icon-button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<FormElements::IconButton />`);
    assert.equal(this.element.textContent.trim(), '');

    await render(hbs`
      <FormElements::IconButton @label='Click'>
        <svg id="icon"></svg>
      </FormElements::IconButton>
    `);

    assert.dom('svg#icon').exists();
    assert.dom('span').exists();
    assert.dom('span').hasText('Click');
  });
});
