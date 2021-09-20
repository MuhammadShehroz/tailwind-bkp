import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | power-select-selected-item',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      await render(
        hbs`<PowerSelectSelectedItem @option={{hash name='the name'}} @valuePath='name'/>`
      );
      assert.equal(this.element.textContent.trim(), 'the name');

      await render(
        hbs`<PowerSelectSelectedItem @option={{hash someKey='a kinda val'}} @valuePath='someKey'/>`
      );
      assert.equal(this.element.textContent.trim(), 'a kinda val');
    });
  }
);
