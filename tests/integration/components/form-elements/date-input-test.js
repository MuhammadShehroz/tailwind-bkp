import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-elements/date-input', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('testDate', new Date('2021-04-20T10:00:00'));
    this.set('format', 'MM-DD-YYYY');
    await render(hbs`
      <FormElements::DateInput
        @value={{testDate}}
        @format={{format}}
      />
    `);
    assert.dom('.tw-date-input').exists();
    assert.dom('.tw-date-input').hasValue('04-20-2021');

    this.set('today', new Date());
    await render(hbs`
      <FormElements::DateInput
        @value='wrong date'
        @format='DD/MM/YYYY'
        @useUTC={{false}}
      />
    `);
    assert
      .dom('.tw-date-input')
      .hasValue(this.today.toLocaleDateString('en-GB'));
  });
});
