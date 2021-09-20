import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | onboarding/add-client', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`
      <Onboarding::AddClient/>
    `);

    assert.dom('h2').hasText('Add a client');
    assert.dom('h2').exists({ count: 1 });

    assert.dom('h1').doesNotExist();

    await render(hbs`
      <Onboarding::AddClient @title='The thing'>
        <p>template block text</p>
      </Onboarding::AddClient>
    `);

    assert.dom('h2').hasText('Add a client');
    assert.dom('h2').exists({ count: 1 });

    assert.dom('h1').hasText('The thing');
    assert.dom('h1').exists({ count: 1 });

    assert.dom('p').hasText('template block text');
    assert.dom('p').exists({ count: 1 });
  });
});
