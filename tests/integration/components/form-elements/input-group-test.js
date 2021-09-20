import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | form-elements/input-group', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders text input field, attributes, label, tooltip, error messages and so on', async function (assert) {
    let model = {
      validations: { attrs: { name: { message: 'Error message' } } },
      name: ''
    };
    this.set('model', model);
    this.set('value', 'name');

    this.set('label', '');
    await render(hbs`
      <FormElements::InputGroup
        @value={{value}}
      >
      </FormElements::InputGroup>
    `);
    assert.dom('label').doesNotExist();

    this.set('label', 'Name');
    await render(hbs`
      <FormElements::InputGroup
        @value={{value}}
        @label={{label}}
      >
      </FormElements::InputGroup>
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
      <FormElements::InputGroup
        disabled={{disabled}}
        @value={{value}}
      >
      </FormElements::InputGroup>
    `);
    assert.dom('input').hasAttribute('disabled', '');

    assert.dom('input').doesNotHaveAttribute('placeholder');
    this.set('placeholder', 'Enter your name');
    await render(hbs`
      <FormElements::InputGroup
        @value={{value}}
        placeholder={{placeholder}}
      >
      </FormElements::InputGroup>
    `);
    assert.dom('input').hasAttribute('placeholder', this.placeholder);

    assert.dom('p.hint').doesNotExist();
    this.set('hint', 'Hint message');
    await render(hbs`
      <FormElements::InputGroup
        @value={{value}}
        @hint={{hint}}
      >
      </FormElements::InputGroup>
    `);
    assert.dom('p.hint').exists();
    assert.dom('p.hint').hasText(this.hint);

    assert.dom('p.error').doesNotExist();
    await render(hbs`
      <FormElements::InputGroup
        @value={{value}}
        @showErrors=true
        @errorMessage={{model.validations.attrs.name.message}}
      >
      </FormElements::InputGroup>
    `);
    assert.dom('p.error').exists();
    assert.dom('p.error').hasText('Error message');

    assert.dom('button.tw-button').doesNotExist();
    await render(hbs`
      <FormElements::InputGroup
        @value={{value}}
        @showClear={{true}}
      >
      </FormElements::InputGroup>
    `);
    this.set('value', 'John Doe');
    assert.equal(find('input').value, 'John Doe', 'Fill field');
    assert.dom('button.clear').exists();
    await click('button.clear');
    assert.equal(this.value, '', 'Clear Field');

    assert.dom('.trailing-button').doesNotExist();
    await render(hbs`
      <FormElements::InputGroup
        @value='firstName'
        @label='First name'
        @buttonLabel='Save'
        @leadingIcon={{true}}
        @trailingButton={{true}}
        as |input|>
          {{#input.leadingIcon}}
            <!-- Heroicon name: solid/users -->
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          {{/input.leadingIcon}}
          {{#input.trailingButton}}
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
               <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
               <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
             </svg>
          {{/input.trailingButton}}
      </FormElements::InputGroup>
    `);
    assert.dom('.tw-icon').exists();
    assert.dom('.trailing-button').exists();

    this.set('onButtonClick', () => {
      this.set('clicked', true);
    });
    this.set('clicked', false);
    assert.equal(this.clicked, false, 'check trailing button click action');
    await render(hbs`
      <FormElements::InputGroup
        @value='firstName'
        @label='First name'
        @buttonLabel='Save'
        @onButtonClick={{action onButtonClick}}
        @trailingButton={{true}}
        as |input|>
          {{#input.trailingButton}}
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
               <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
               <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
             </svg>
          {{/input.trailingButton}}
      </FormElements::InputGroup>
    `);
    await click('button');
    assert.equal(this.clicked, true);
  });
});
