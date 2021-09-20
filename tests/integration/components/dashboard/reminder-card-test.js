import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { flashMessagesMock } from '../../../helpers/flash-message';
import Service from '@ember/service';

const registerUserService = (owner, override) =>
  owner.register(
    'service:user',
    Service.extend({
      current: Promise.resolve({
        isLoaded: true,
        confirmedAt: null,
        ...override
      })
    })
  );

module('Integration | Component | dashboard/reminder-card', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders nothing when user is loading', async function (assert) {
    registerUserService(this.owner, {
      isLoaded: false
    });

    await render(hbs`
      <Dashboard::ReminderCard />
    `);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('it renders nothing when user is confirmed', async function (assert) {
    registerUserService(this.owner, {
      confirmedAt: new Date()
    });

    await render(hbs`
      <Dashboard::ReminderCard />
    `);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('it renders sensible defaults', async function (assert) {
    registerUserService(this.owner, {});

    await render(hbs`
      <Dashboard::ReminderCard />
    `);

    assert.dom('h3').exists({ count: 1 });
    assert.dom('h3').hasText('Reminder');

    assert.dom('p').exists({ count: 1 });
    assert.dom('p').hasText("You haven't confirmed your email address.");

    assert.dom(this.element.querySelectorAll('button')[0]).exists({ count: 1 });
    assert
      .dom(this.element.querySelectorAll('button')[0])
      .hasText('Resend verification link');

    assert.dom(this.element.querySelectorAll('button')[1]).exists({ count: 1 });
    assert
      .dom(this.element.querySelectorAll('button')[1])
      .hasText('Get support');
  });

  test('it opens zendesk', async function (assert) {
    registerUserService(this.owner, {});
    let arrayOfCalledItems = [];

    this._openZendesk = () =>
      arrayOfCalledItems.push({
        functionName: 'openZendesk'
      });

    await render(hbs`
      <Dashboard::ReminderCard
        @_openZendesk={{_openZendesk}}
      />
    `);

    await click(this.element.querySelectorAll('button')[1]);
    await click(this.element.querySelectorAll('button')[1]);
    await click(this.element.querySelectorAll('button')[1]);

    assert.deepEqual(arrayOfCalledItems, [
      {
        functionName: 'openZendesk'
      },
      {
        functionName: 'openZendesk'
      },
      {
        functionName: 'openZendesk'
      }
    ]);
  });

  test('it performs verification resend action', async function (assert) {
    let arrayOfCalledItems = [];

    registerUserService(this.owner, {
      resendVerification: () => {
        arrayOfCalledItems.push({
          functionName: 'resendVerification'
        });
        return Promise.resolve({});
      }
    });

    this.flashMessagesTest = flashMessagesMock(arrayOfCalledItems);

    await render(hbs`
      <Dashboard::ReminderCard
        @flashMessages={{flashMessagesTest}}
      />
    `);

    await click(this.element.querySelectorAll('button')[0]);

    assert.deepEqual(arrayOfCalledItems, [
      {
        arguments: [],
        functionName: 'flash-messages:clearMessages'
      },
      {
        functionName: 'resendVerification'
      },
      {
        arguments: ['Verification email sent.'],
        functionName: 'flash-messages:add'
      }
    ]);
  });
});
