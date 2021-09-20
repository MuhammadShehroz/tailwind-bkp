import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | layouts/auth-layout', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(2);

    await render(hbs`
      {{#layouts/auth-layout}}
        template block text
      {{/layouts/auth-layout}}
    `);

    assert.dom('footer#footer').exists();
    assert.dom('main').hasText('template block text');
  });
});
