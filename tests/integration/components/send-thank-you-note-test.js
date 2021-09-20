import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import ClientsService from '../../helpers/clients-service';
import EmberObject from '@ember/object';
import RSVP from 'rsvp';

module('Integration | Component | send-thank-you-note', function (hooks) {
  setupRenderingTest(hooks);

  let members = [
    { name: 'Adam John', email: 'adam@gmail.com' },
    { name: 'Peter Simon', email: 'peter@gmail.com' }
  ];

  let user = {
    email: 'eni@as.com',
    name: 'Eni Admin'
  };

  let userAndMembers = [user, ...members];

  hooks.beforeEach(function () {
    let contacts = [
      { id: 1, name: 'Foo', email: 'foo@example.com' },
      { id: 3, name: 'Bar', email: 'bar@example.com' }
    ];
    this.owner.register(
      'service:clients',
      new ClientsService([{ name: 'Acme Inc.', contacts }])
    );

    let store = this.owner.lookup('service:store');
    store.findAll = () => members;
  });

  test('it collects input and sends', async function (assert) {
    this.set('accept', (delivery) => {
      assert.deepEqual(delivery.getProperties('message'), {
        message: 'Here is your invoice'
      });

      let { ccRecipients } = delivery;
      ccRecipients.forEach(({ name, email }, idx) => {
        assert.equal(name, userAndMembers[idx].name);
        assert.equal(email, userAndMembers[idx].email);
      });
    });

    this.set(
      'document',
      EmberObject.create({
        modelName: 'invoice',
        buildDelivery() {
          return new RSVP.Promise((resolve) => {
            resolve(
              EmberObject.create({
                rollbackAttributes() {},
                validate() {
                  return new RSVP.Promise((resolve) => {
                    resolve(
                      EmberObject.create({
                        validations: EmberObject.create({
                          isValid: true
                        })
                      })
                    );
                  });
                }
              })
            );
          });
        }
      })
    );

    await render(hbs`
      {{send-thank-you-note document=document kind='thank_you' accept=(action accept)}}
    `);

    assert.dom('h2').hasText('Send Thank-You Note');
  });
});
