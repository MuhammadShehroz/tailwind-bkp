import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | blank-template', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<BlankTemplate />`);

    assert.equal(this.element.textContent.trim(), '');

    await render(hbs`
      <BlankTemplate>
        template block text
      </BlankTemplate>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
