import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | onboarding/welcome', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(7);

    this.onNext = () => assert.ok(1);

    await render(hbs`
      <Onboarding::Welcome @onNext={{onNext}}/>
    `);

    assert.dom('h1').hasText('Welcome to Blinksale!');
    assert.dom('h1').exists({ count: 1 });

    assert.dom('button').hasText('Lets start by adding a client.');
    assert.dom('button').exists({ count: 1 });

    await click('button');
    await click('button');
    await click('button');
  });
});
