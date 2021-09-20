import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | format-number', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(3);

    await render(hbs`{{format-number value=12345 decimals=3}}`);
    assert.dom(this.element).hasText('12,345.000');

    await render(hbs`{{format-number value=12.345 decimals=2}}`);
    assert.dom(this.element).hasText('12.35');

    await render(
      hbs`{{format-number value=12345.967 decimals=2 thousandsSeparator='.' decimalsSeparator=','}}`
    );
    assert.dom(this.element).hasText('12.345,97');
  });
});
