import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-control/index', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`
      <FormControl::Index @label='The Label' as |control|>
        <p id={{control.id}}>The Para</p>
      </FormControl::Index>
    `);

    assert.dom('label').exists({ count: 1 });
    assert.dom('label').hasText('The Label');
    assert.dom('p').hasAttribute('id');
    assert.ok(this.element.querySelector('p').getAttribute('id'));
  });
});
