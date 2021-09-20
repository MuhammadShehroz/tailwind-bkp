import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click, findAll } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | onboarding/index', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.stepIndex = 0;
    this.onNext = () => this.set('stepIndex', this.stepIndex + 1);
    this.client = this.owner.lookup('service:store').createRecord('client');
  });

  hooks.afterEach(function () {
    this.client.unloadRecord();
  });

  test('it renders default', async function (assert) {
    await render(hbs`<Onboarding::Index @client={{client}} />`);

    assert.dom('.welcome').exists({ count: 1 });
    assert.dom('.add-client.client-type').doesNotExist();
    assert.dom('.add-client.client-name').doesNotExist();
    assert.dom('.add-client.client-email').doesNotExist();
    assert.dom('.add-client.confirmed').doesNotExist();
  });

  test('transition between steps', async function (assert) {
    await render(hbs`
      <Onboarding::Index
        @client={{client}}
        @stepIndex={{stepIndex}}
        @onNext={{action onNext}}
      />
    `);

    assert.dom('.welcome').exists({ count: 1 });
    assert.dom('.add-client.client-type').doesNotExist();
    assert.dom('.add-client.client-name').doesNotExist();
    assert.dom('.add-client.client-email').doesNotExist();
    assert.dom('.add-client.confirmed').doesNotExist();

    // goto type step
    await click('.welcome button');

    assert.dom('.welcome').doesNotExist();
    assert.dom('.add-client.client-type').exists({ count: 1 });
    assert.dom('.add-client.client-name').doesNotExist();
    assert.dom('.add-client.client-email').doesNotExist();
    assert.dom('.add-client.confirmed').doesNotExist();

    // goto name step
    this.set('stepIndex', 2);

    assert.dom('.welcome').doesNotExist();
    assert.dom('.add-client.client-type').doesNotExist();
    assert.dom('.add-client.client-name').exists({ count: 1 });
    assert.dom('.add-client.client-email').doesNotExist();
    assert.dom('.add-client.confirmed').doesNotExist();

    // goto email step
    this.set('stepIndex', 3);

    assert.dom('.welcome').doesNotExist();
    assert.dom('.add-client.client-type').doesNotExist();
    assert.dom('.add-client.client-name').doesNotExist();
    assert.dom('.add-client.client-email').exists({ count: 1 });
    assert.dom('.add-client.confirmed').doesNotExist();

    // goto confirmed step
    this.set('stepIndex', 4);

    assert.dom('.welcome').doesNotExist();
    assert.dom('.add-client.client-type').doesNotExist();
    assert.dom('.add-client.client-name').doesNotExist();
    assert.dom('.add-client.client-email').doesNotExist();
    assert.dom('.add-client.confirmed').exists({ count: 1 });
  });

  test('company client type validations', async function (assert) {
    this.stepIndex = 1;
    this.validationsEnabled = false;

    await render(hbs`
      <Onboarding::Index
        @client={{client}}
        @stepIndex={{stepIndex}}
        @validationsEnabled={{validationsEnabled}}
        @onNext={{action onNext}}
      />
    `);

    // company selected by default
    assert.dom(findAll('button')[0]).hasClass('selected');

    // //----------------- Client name
    // goto next step
    this.set('stepIndex', 2);

    // has only one name field
    assert.dom('.field.text-field').exists({ count: 1 });
    assert.dom('.field.text-field').doesNotHaveAttribute('placeholder');
    assert.dom('.field.text-field').doesNotHaveClass('field-with-errors');

    // enable UI validation
    this.set('validationsEnabled', true);

    // validate client
    await this.client.validate({ on: ['companyName'] });
    assert.dom('.field.text-field').hasClass('field-with-errors');

    // fill in company name
    await fillIn('.field.text-field input', 'The Company');

    // validate client
    await this.client.validate({ on: ['companyName'] });
    assert.dom('.field.text-field').doesNotHaveClass('field-with-errors');

    // disable UI validation
    this.set('validationsEnabled', false);

    // //----------------- Client email
    this.set('stepIndex', 3);

    // has only one email field
    assert.dom('.field.text-field').exists({ count: 1 });
    assert
      .dom('.field.text-field input')
      .hasAttribute('placeholder', '(this is optional)');
    assert.dom('.field.text-field').doesNotHaveClass('field-with-errors');

    // enable UI validation
    this.set('validationsEnabled', true);

    // validate client
    await this.client.validate({ on: ['email'] });
    assert.dom('.field.text-field').doesNotHaveClass('field-with-errors');

    assert.deepEqual(this.client.getProperties('companyName', 'email'), {
      email: undefined,
      companyName: 'The Company'
    });
  });

  test('individual client type validations', async function (assert) {
    this.stepIndex = 1;
    this.validationsEnabled = false;

    await render(hbs`
      <Onboarding::Index
        @client={{client}}
        @stepIndex={{stepIndex}}
        @validationsEnabled={{validationsEnabled}}
        @onNext={{action onNext}}
      />
    `);

    // company selected by default
    assert.dom(findAll('button')[0]).hasClass('selected');
    assert.dom(findAll('button')[1]).doesNotHaveClass('selected');

    // switch to individual
    await click(findAll('button')[1]);
    assert.dom(findAll('button')[0]).doesNotHaveClass('selected');
    assert.dom(findAll('button')[1]).hasClass('selected');

    // //----------------- Client name
    // goto next step
    this.set('stepIndex', 2);

    // has only one name field
    assert.dom('.field.text-field').exists({ count: 2 });
    assert
      .dom(findAll('.field.text-field')[0].querySelector('input'))
      .hasAttribute('placeholder', 'First name');
    assert
      .dom(findAll('.field.text-field')[1].querySelector('input'))
      .hasAttribute('placeholder', 'Last name');
    assert
      .dom(findAll('.field.text-field')[0])
      .doesNotHaveClass('field-with-errors');
    assert
      .dom(findAll('.field.text-field')[1])
      .doesNotHaveClass('field-with-errors');

    // enable UI validation
    this.set('validationsEnabled', true);

    // validate client
    await this.client.validate({ on: ['firstName', 'lastName'] });

    assert.dom(findAll('.field.text-field')[0]).hasClass('field-with-errors');
    assert.dom(findAll('.field.text-field')[1]).hasClass('field-with-errors');

    // fill in first and last name
    await fillIn(findAll('.field.text-field')[0].querySelector('input'), 'Foo');
    await fillIn(findAll('.field.text-field')[1].querySelector('input'), 'Bar');

    // validate client
    await this.client.validate({ on: ['firstName', 'lastName'] });
    assert
      .dom(findAll('.field.text-field')[0])
      .doesNotHaveClass('field-with-errors');
    assert
      .dom(findAll('.field.text-field')[1])
      .doesNotHaveClass('field-with-errors');

    // disable UI validation
    this.set('validationsEnabled', false);

    // //----------------- Client email
    this.set('stepIndex', 3);

    // has only one email field
    assert.dom('.field.text-field').exists({ count: 1 });
    assert
      .dom('.field.text-field input')
      .hasAttribute('placeholder', '(this is optional)');
    assert.dom('.field.text-field').doesNotHaveClass('field-with-errors');

    // enable UI validation
    this.set('validationsEnabled', true);

    // fill in email
    await fillIn('.field.text-field input', 'some@email.com');

    // validate client email
    await this.client.validate({ on: ['email'] });
    assert.dom('.field.text-field').doesNotHaveClass('field-with-errors');

    assert.deepEqual(
      this.client.getProperties('firstName', 'lastName', 'email'),
      {
        firstName: 'Foo',
        lastName: 'Bar',
        email: 'some@email.com'
      }
    );
  });

  test('links to the correct routes with params', async function (assert) {
    this.stepIndex = 4;
    this.client = {
      id: 'clientID',
      set() {},
      unloadRecord() {}
    };
    this.calledItems = [];
    this.linkTo = (...args) =>
      this.calledItems.push({
        functonName: 'linkTo',
        arguments: [...args]
      });

    await render(hbs`
      <Onboarding::Index
        @client={{client}}
        @stepIndex={{stepIndex}}
        @onLinkTo={{linkTo}}
      />
    `);

    await click(findAll('.add-client.confirmed a')[0]);
    await click(findAll('.add-client.confirmed a')[1]);
    await click(findAll('.add-client.confirmed a')[2]);

    assert.deepEqual(this.calledItems, [
      {
        arguments: ['clients.edit', this.client],

        functonName: 'linkTo'
      },
      {
        arguments: [
          'invoices.new',
          {
            queryParams: {
              client: 'clientID'
            }
          }
        ],

        functonName: 'linkTo'
      },
      {
        arguments: [
          'estimates.new',
          {
            queryParams: {
              client: 'clientID'
            }
          }
        ],

        functonName: 'linkTo'
      }
    ]);
  });
});
