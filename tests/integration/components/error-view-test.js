import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | error-view', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`
      <ErrorView
        @class='error-404'
        @title='Error 404'
        @description='Page not found'
        @message='You may have followed an old link.'
        @route='index'
        @linkText='Back to your dashboard'
      />
    `);

    assert.dom('.illustration').exists({ count: 1 });

    assert.dom('.title').exists({ count: 1 });
    assert.dom('.title').hasText('Error 404');

    assert.dom('.description').exists({ count: 1 });
    assert.dom('.description').hasText('Page not found');

    assert.dom('.message').exists({ count: 1 });
    assert.dom('.message').hasText('You may have followed an old link.');

    assert.dom('.btn').exists({ count: 1 });
    assert.dom('.btn').hasText('Back to your dashboard');
    assert.dom('.btn').doesNotHaveAttribute('href');

    await render(hbs`
      <ErrorView
        @class='error-404'
        @title='Error 404'
        @description='Page not found'
        @message='You may have followed an old link.'
        @href='www.foobar.com'
        @linkText='Back to your dashboard'
      />
    `);

    assert.dom('.btn').hasAttribute('href', 'www.foobar.com');
  });
});
