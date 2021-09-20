import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | banner/status-bar', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.lookup('router:main').setupRouter(); // eslint-disable-line ember/no-private-routing-service
  });

  test('it renders defaults', async function (assert) {
    await render(hbs`
      <Banner::StatusBar>
        The content
      </Banner::StatusBar>
    `);

    assert.dom('.status-bar').hasText('The content');
    assert.dom('button').doesNotExist();
  });

  test('dispatch actions to parent', async function (assert) {
    let arrayOfCalledItems = [];

    this.onClose = () =>
      arrayOfCalledItems.push({
        functionName: 'onClose'
      });

    await render(hbs`
      <Banner::StatusBar
        @onClose={{onClose}}
      />
    `);

    assert.dom('button').exists({ count: 1 });

    await click('button');
    await click('button');
    await click('button');

    assert.deepEqual(arrayOfCalledItems, [
      {
        functionName: 'onClose'
      },
      {
        functionName: 'onClose'
      },
      {
        functionName: 'onClose'
      }
    ]);
  });
});
