import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | layouts/portal-layout', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(2);

    await render(hbs`
      {{#layouts/portal-layout}}
        template block text
      {{/layouts/portal-layout}}
    `);

    assert.dom('footer').exists();
    assert.dom('main').hasText('template block text');
  });
});
