import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | flash-messages/custom-flash',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      await render(hbs`<FlashMessages::CustomFlash />`);
      assert.dom('.tw-button').hasText('Close');

      await render(hbs`
      <FlashMessages::CustomFlash>
        <button class="tw-button">Save</button>
      </FlashMessages::CustomFlash>
    `);
      assert.dom('.tw-button').hasText('Save');
    });
  }
);
