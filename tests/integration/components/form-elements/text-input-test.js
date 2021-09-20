import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, blur } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-elements/text-input', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders text input field, attributes, label, tooltip, error messages and so on', async function (assert) {
    this.set('label', '');
    this.set('showErrors', true);
    await render(hbs`
      <FormElements::TextInput />
    `);
    assert.dom('label').doesNotExist();

    this.set('label', 'Name');
    await render(hbs`
      <FormElements::TextInput
        @label={{label}}
      />
    `);
    assert.dom('label').exists();
    assert.dom('label').hasText(this.label);
    let labelFor = find('label').getAttribute('for');
    let inputId = find('input').getAttribute('id');
    assert.equal(
      labelFor,
      inputId,
      'label for and input id attributes has the same value'
    );

    this.set('disabled', true);
    await render(hbs`
      <FormElements::TextInput
        disabled={{disabled}}
      />
    `);
    assert.dom('input').hasAttribute('disabled', '');

    assert.dom('input').doesNotHaveAttribute('placeholder');
    this.set('placeholder', 'Enter your name');
    await render(hbs`
      <FormElements::TextInput
        placeholder={{placeholder}}
      />
    `);
    assert.dom('input').hasAttribute('placeholder', this.placeholder);

    assert.dom('.hint').doesNotExist();
    this.set('hint', 'Hint message');
    await render(hbs`
      <FormElements::TextInput
        @hint={{hint}}
      />
    `);
    assert.dom('.hint').exists();
    assert.dom('.hint').hasText(this.hint);

    this.set('errorMessage', 'Error message');
    assert.dom('.error').doesNotExist();
    await render(hbs`
      <FormElements::TextInput
        @showErrors={{showErrors}}
        @errorMessage={{errorMessage}}
      />
    `);
    assert
      .dom('p.error')
      .doesNotExist('Error doesnt shown before onblur event is fired');
    await click('input');
    await blur('input');
    assert.dom('p.error').exists('Error is shown after onblur event');
    assert.dom('p.error').hasText(this.errorMessage);
    await click('input');
    assert
      .dom('p.error')
      .exists('Error is still displayed when input has focus again');
    this.set('showErrors', false);
    assert
      .dom('p.error')
      .doesNotExist(
        'Error goes away when value changed to valid without onblur event'
      );

    this.set('value', 'John Doe');
    assert.dom('button.tw-icon.left #leading-icon').doesNotExist();
    await render(hbs`
      <FormElements::TextInput
        @value={{value}}
        @allowClear={{true}}
        @showErrors={{showErrors}}
        @leadingIcon='#'
        @trailingIcon={{true}}
        as |leadingIcon trailingIcon showClear showErrors onTrailingIconClick|
      >
        <FormElements::InputLeadingIcon>
          <span class="text-gray-500 sm:text-sm" id="leading-icon">{{leadingIcon}}</span>
        </FormElements::InputLeadingIcon>
        <FormElements::InputTrailingIcon @onTrailingIconClick={{onTrailingIconClick}} @showClear={{showClear}} @showErrors={{showErrors}}/>
      </FormElements::TextInput>
    `);
    assert.dom('button.tw-icon.left #leading-icon').exists();
    assert.dom('button.tw-icon.left #leading-icon').hasText('#');
    await click('button.tw-icon.right');
    assert.equal(this.value, '', 'Clear Field');
  });
});
