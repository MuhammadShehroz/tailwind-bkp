import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | document-branding/step', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`
      <DocumentBranding::Step
        @heading='The heading'
        @subheading='The Sub Heading'
      >
        <span>template block text</span>
      </DocumentBranding::Step>
    `);

    assert.dom('h2').hasText('The heading');
    assert.dom('p').hasText('The Sub Heading');
    assert.dom('span').hasText('template block text');
  });
});
