import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupFactoryGuy } from 'ember-data-factory-guy';
import tinycolor from 'tinycolor2';
import EmberObject from '@ember/object';

const buttonColor = (button) =>
  `#${tinycolor(button.style.backgroundColor).toHex().toUpperCase()}`;

module(
  'Integration | Component | document-branding/add-header-color',
  function (hooks) {
    setupRenderingTest(hooks);
    setupFactoryGuy(hooks);

    hooks.beforeEach(function () {
      this.modelTest = this.modelTest = EmberObject.create({
        buttonColor: ''
      });
    });

    test('it renders', async function (assert) {
      await render(
        hbs`<DocumentBranding::AddHeaderColor @model={{modelTest}}/>`
      );

      assert.dom('h2').hasText('Select Header Color');
      assert
        .dom('p')
        .hasText(
          'Enter a hex color value or use the color swatches sampled from your logo.'
        );
      assert.dom('header').hasAttribute('style', 'background-color: #354656;');
      assert.dom('header img').doesNotExist();
      assert.dom('.color-input').exists({ count: 1 });
      assert.dom('.color-palette-control').exists({ count: 1 });
    });

    test('it changes header color', async function (assert) {
      await render(
        hbs`<DocumentBranding::AddHeaderColor @model={{modelTest}}/>`
      );

      let buttons = this.element.querySelectorAll(
        '.color-palette-control button'
      );

      await click(buttons[0]);
      assert
        .dom('header')
        .hasAttribute('style', `background-color: ${buttonColor(buttons[0])};`);

      await click(buttons[3]);
      assert
        .dom('header')
        .hasAttribute('style', `background-color: ${buttonColor(buttons[3])};`);

      await click(buttons[5]);
      assert
        .dom('header')
        .hasAttribute('style', `background-color: ${buttonColor(buttons[5])};`);

      await click(buttons[6]);
      assert
        .dom('header')
        .hasAttribute('style', `background-color: ${buttonColor(buttons[6])};`);

      await click(buttons[8]);
      assert
        .dom('header')
        .hasAttribute('style', `background-color: ${buttonColor(buttons[8])};`);
    });
  }
);
