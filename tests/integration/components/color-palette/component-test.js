import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import tinycolor from 'tinycolor2';
import sinon from 'sinon';

const buttonColor = (button) =>
  `#${tinycolor(button.style.backgroundColor).toHex().toUpperCase()}`;

module('Integration | Component | color-palette', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<ColorPalette />`);

    assert.dom('button').exists({ count: 10 });

    findAll('button').forEach((button) => {
      assert
        .dom(button)
        .hasAttribute('style', `background-color: ${buttonColor(button)};`);
    });
  });

  test('it first onclick event for a color', async function (assert) {
    this.onClickColorTest = sinon.spy();

    await render(hbs`<ColorPalette @onClickColor={{onClickColorTest}}/>`);

    await click(findAll('button')[0]);
    await click(findAll('button')[7]);
    await click(findAll('button')[4]);
    await click(findAll('button')[9]);
    await click(findAll('button')[1]);

    assert.deepEqual(this.onClickColorTest.args, [
      ['#20E684'],
      ['#151515'],
      ['#FF8A00'],
      ['#354656'],
      ['#8B17D0']
    ]);

    assert.equal(this.onClickColorTest.callCount, 5);
  });

  test('it uses custom default color', async function (assert) {
    await render(hbs`<ColorPalette @defaultColor='#444444' />`);

    assert
      .dom(findAll('button')[9])
      .hasAttribute('style', 'background-color: #444444;');
  });

  test('it uses custom colors and limits number of colors', async function (assert) {
    this.colorsTest = [
      'red',
      'yellow',
      'blue',
      'green',
      'purple',
      'gray',
      'brown',
      'pink',
      'orange',
      'cyan',
      'coral',
      'lightpink'
    ];

    await render(hbs`<ColorPalette @colors={{colorsTest}}/>`);

    assert
      .dom(findAll('button')[0])
      .hasAttribute('style', `background-color: red;`);
    assert
      .dom(findAll('button')[1])
      .hasAttribute('style', `background-color: yellow;`);
    assert
      .dom(findAll('button')[2])
      .hasAttribute('style', `background-color: blue;`);
    assert
      .dom(findAll('button')[3])
      .hasAttribute('style', `background-color: green;`);
    assert
      .dom(findAll('button')[4])
      .hasAttribute('style', `background-color: purple;`);
    assert
      .dom(findAll('button')[5])
      .hasAttribute('style', `background-color: gray;`);
    assert
      .dom(findAll('button')[6])
      .hasAttribute('style', `background-color: brown;`);
    assert
      .dom(findAll('button')[7])
      .hasAttribute('style', `background-color: #151515;`);

    assert.dom('button').exists({ count: 10 });
  });
});
