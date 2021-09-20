import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  settled,
  findAll,
  clearRender
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import {
  setupFactoryGuy,
  mock,
  make,
  makeList,
  mockUpdate,
  mockFindAll
} from 'ember-data-factory-guy';
import { removeMultipleOption } from 'ember-power-select/test-support';
import sinon from 'sinon';
import Component from '@ember/component';

module('Integration | Component | pages/document-preview', function (hooks) {
  setupRenderingTest(hooks);
  setupFactoryGuy(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'component:document-preview',
      Component.extend({
        classNames: ['document-preview'],
        layout: hbs`<iframe></iframe>`
      })
    );

    let windowMessage = this.owner.lookup('service:window-message');

    this.windowMessageStub = {
      postMessage: sinon.stub(windowMessage, 'postMessage'),
      registerListener: sinon
        .stub(windowMessage, 'registerListener')
        .onCall(0)
        .returns(sinon.spy())
        .onCall(1)
        .returns(sinon.spy())
        .onCall(2)
        .returns(sinon.spy())
        .returns(sinon.spy())
    };

    let context = this;
    context.calledItems = [];

    this.owner.register(
      'service:modals',
      Service.extend({
        open: (name, { onAccept }) => (context.onAcceptMessage = onAccept)
      })
    );

    this.owner.register(
      'service:organization',
      Service.extend({
        current: make('organization')
      })
    );

    this.owner.register(
      'service:clients',
      Service.extend({
        contacts: async () => makeList('contact', 3)
      })
    );

    this.owner.register(
      'service:user',
      Service.extend({
        email: null
      })
    );

    this.owner.register(
      'service:storage',
      Service.extend({
        setSessionItem(...args) {
          context.calledItems.push({
            functionName: 'storage:setSessionItem',
            arguments: args
          });
        }
      })
    );

    this.owner.unregister('service:router');
    this.owner.register(
      'service:router',
      Service.extend({
        currentURL: 'the.current.url',
        transitionTo(...args) {
          context.calledItems.push({
            functionName: 'router:transitionTo',
            arguments: args
          });
        }
      })
    );

    mockFindAll('member', 3);
    this.model = make('invoice', 'withClient');
    this.model.previewDoc = () => {};
    this.model.buildDelivery = async () => make('delivery');
  });

  test('it renders default', async function (assert) {
    await render(hbs`<Pages::DocumentPreview @model={{model}}/>`);

    assert.dom('.send-to-field').exists({ count: 1 });
    assert.dom('.cc-select').doesNotExist();
    assert.dom('.subject-field').exists({ count: 1 });
    assert.dom('.message-field').exists({ count: 1 });
    assert.dom('.payment-field').doesNotExist();

    assert.dom('.document-preview').exists({ count: 1 });

    assert.dom('header .edit-template').exists({ count: 1 });
    assert.dom('.edit-template .toggle-switch').exists({ count: 1 });
    assert.dom('.edit-template button').doesNotExist();

    assert.dom('footer').exists({ count: 1 });
    assert.dom('footer button.send').exists({ count: 1 });
    assert.dom('footer a.edit').exists({ count: 1 });
  });

  test('it apply delivery default options', async function (assert) {
    this.model.buildDelivery = async () =>
      make('delivery', {
        subject: 'my custom subject',
        message: 'my custom message'
      });

    await render(hbs`<Pages::DocumentPreview @model={{model}}/>`);

    assert.dom('.subject-field input').hasValue('my custom subject');
    assert.dom('.message-field .message').hasText('my custom message');
  });

  test('it validates send form', async function (assert) {
    await render(hbs`<Pages::DocumentPreview @model={{model}}/>`);

    assert
      .dom('.send-to-field .contact-select')
      .doesNotHaveClass('field-with-errors');

    // Remove all three contacts selected by default
    await removeMultipleOption(
      '.send-to-field .contact-select',
      'Contact first name 1 Contact last name 1'
    );
    await removeMultipleOption(
      '.send-to-field .contact-select',
      'Contact first name 2 Contact last name 2'
    );
    await removeMultipleOption(
      '.send-to-field .contact-select',
      'Contact first name 3 Contact last name 3'
    );

    await click('footer button.send');

    assert.dom('.send-to-field .contact-select').hasClass('field-with-errors');
  });

  test('it activates payments', async function (assert) {
    this.owner.lookup('service:organization').set(
      'current',
      make('organization', {
        isStripeConnected: false,
        isPaypalConnected: false
      })
    );

    await render(
      hbs`<Pages::DocumentPreview @model={{model}} @showPaymentOptions={{true}}/>`
    );

    await click('.payment-field button.activate-payment');

    assert.deepEqual(this.calledItems, [
      {
        arguments: [
          'redirectURL',
          'account.payment-methods',
          'the.current.url'
        ],

        functionName: 'storage:setSessionItem'
      },
      {
        arguments: ['account.payment-methods'],

        functionName: 'router:transitionTo'
      }
    ]);
  });

  test('it toggles cc field', async function (assert) {
    await render(hbs`<Pages::DocumentPreview @model={{model}}/>`);

    assert.dom('.cc-select').doesNotExist();

    await click(
      this.element.querySelectorAll('.send-to-field .actions button')[0]
    );

    assert.dom('.cc-select').exists({ count: 1 });

    await click(
      this.element.querySelectorAll('.send-to-field .actions button')[0]
    );

    assert.dom('.cc-select').doesNotExist();
  });

  test('it toggles bcc field', async function (assert) {
    await render(hbs`<Pages::DocumentPreview @model={{model}}/>`);

    assert.dom('.bcc-select').doesNotExist();

    await click(
      this.element.querySelectorAll('.send-to-field .actions button')[1]
    );

    assert.dom('.bcc-select').exists({ count: 1 });

    await click(
      this.element.querySelectorAll('.send-to-field .actions button')[1]
    );

    assert.dom('.bcc-select').doesNotExist();
  });

  test('it renders default org invoice message', async function (assert) {
    this.owner.lookup('service:organization').set(
      'current',
      make('organization', {
        invoiceMessage: 'Current message of invoice'
      })
    );

    await render(hbs`<Pages::DocumentPreview @model={{model}}/>`);

    assert.dom('.message-field .message').hasText('Current message of invoice');
  });

  test('it renders edit message modal', async function (assert) {
    await render(hbs`<Pages::DocumentPreview @model={{model}}/>`);

    await click('.message-field .actions > button');

    this.onAcceptMessage('custom message');

    await settled();

    assert.dom('.message-field .message').hasText('custom message');
  });

  test('it renders payment fields', async function (assert) {
    this.owner.lookup('service:organization').set(
      'current',
      make('organization', {
        isStripeConnected: false,
        isPaypalConnected: false
      })
    );

    await render(
      hbs`<Pages::DocumentPreview @model={{model}} @showPaymentOptions={{true}}/>`
    );

    assert.dom('.payment-field').exists({ count: 1 });
    assert.dom('.payment-field .activate-payment').exists({ count: 1 });

    await clearRender();

    this.owner.lookup('service:organization').set(
      'current',
      make('organization', {
        isStripeConnected: true,
        isPaypalConnected: true
      })
    );

    await render(
      hbs`<Pages::DocumentPreview @model={{model}} @showPaymentOptions={{true}}/>`
    );

    assert.dom('.payment-field').exists({ count: 1 });
    assert.dom('.stripe-switch').exists({ count: 1 });
    assert.dom('.paypal-switch').exists({ count: 1 });
  });

  test('edit template setup listerners', async function (assert) {
    await render(hbs`<Pages::DocumentPreview @model={{model}}/>`);

    assert.equal(this.windowMessageStub.registerListener.callCount, 4);

    await clearRender();

    this.windowMessageStub.registerListener.returnValues.forEach((spy) =>
      assert.equal(spy.callCount, 1)
    );
  });

  test('edit template actions', async function (assert) {
    let modalsSub = sinon.stub(this.owner.lookup('service:modals'));

    await render(hbs`<Pages::DocumentPreview @model={{model}}/>`);

    this.windowMessageStub.registerListener.getCall(0).firstArg();
    this.windowMessageStub.registerListener.getCall(1).firstArg();
    this.windowMessageStub.registerListener.getCall(2).firstArg();

    assert.equal(modalsSub.open.callCount, 3);
    assert.equal(
      modalsSub.open.getCall(0).args[0],
      'document-branding/add-logo'
    );
    assert.equal(
      modalsSub.open.getCall(1).args[0],
      'document-branding/add-header-color'
    );
    assert.equal(
      modalsSub.open.getCall(2).args[0],
      'document-branding/add-accent-color'
    );
  });

  test('edit template reset', async function (assert) {
    mockUpdate('organization', 1);

    mock({
      type: 'POST',
      url: 'api/1/destroy_account_logo',
      responseText: {}
    });

    await render(hbs`<Pages::DocumentPreview @model={{model}}/>`);

    await click('.edit-template .toggle-switch input');

    assert.dom('.edit-template button').exists({ count: 2 });

    // cancel
    await click(findAll('.edit-template button')[1]);

    assert.dom('.edit-template button').doesNotExist();

    await click('.edit-template .toggle-switch input');

    assert.dom('.edit-template button').exists({ count: 2 });

    // reset
    await click(findAll('.edit-template button')[0]);
  });
});
