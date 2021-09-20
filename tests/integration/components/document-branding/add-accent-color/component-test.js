import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupFactoryGuy } from 'ember-data-factory-guy';
import tinycolor from 'tinycolor2';
import EmberObject from '@ember/object';

let buttonColor = (button) =>
  `#${tinycolor(button.style.backgroundColor).toHex().toUpperCase()}`;

module(
  'Integration | Component | document-branding/add-accent-color',
  function (hooks) {
    setupRenderingTest(hooks);
    setupFactoryGuy(hooks);

    hooks.beforeEach(function () {
      this.modelTest = EmberObject.create({
        buttonColor: ''
      });
    });

    test('it renders', async function (assert) {
      await render(
        hbs`<DocumentBranding::AddAccentColor @model={{modelTest}}/>`
      );

      assert.dom('h2').hasText('Select Accent Color');
      assert
        .dom('p')
        .hasText(
          'Enter a hex color value or use the color swatches sampled from your logo.'
        );
      assert.dom('button').hasText('Button');
      assert.dom('button').hasAttribute('style', 'background-color: #1173E6;');
      assert.dom('button').hasClass('dark', 'Default value is a dark color');
      assert.dom('.color-input').exists({ count: 1 });
      assert.dom('.color-palette-control').exists({ count: 1 });
    });

    test('it changes button color', async function (assert) {
      await render(
        hbs`<DocumentBranding::AddAccentColor @model={{modelTest}}/>`
      );

      let buttons = this.element.querySelectorAll(
        '.color-palette-control button'
      );

      await click(buttons[0]);
      assert
        .dom('button')
        .hasAttribute('style', `background-color: ${buttonColor(buttons[0])};`);

      await click(buttons[3]);
      assert
        .dom('button')
        .hasAttribute('style', `background-color: ${buttonColor(buttons[3])};`);

      await click(buttons[5]);
      assert
        .dom('button')
        .hasAttribute('style', `background-color: ${buttonColor(buttons[5])};`);

      await click(buttons[6]);
      assert
        .dom('button')
        .hasAttribute('style', `background-color: ${buttonColor(buttons[6])};`);

      // Click white color
      await click(buttons[8]);
      assert
        .dom('button')
        .hasAttribute('style', `background-color: ${buttonColor(buttons[8])};`);

      assert.dom('button').hasClass('dark');
    });
  }
);
