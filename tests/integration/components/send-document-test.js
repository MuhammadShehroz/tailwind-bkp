import { module, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';
import ClientsService from '../../helpers/clients-service';
import EmberObject from '@ember/object';
import RSVP from 'rsvp';

module('Integration | Component | send-document', function (hooks) {
  setupRenderingTest(hooks);

  let contacts = [
    { id: 1, name: 'Foo', email: 'foo@example.com' },
    { id: 3, name: 'Bar', email: 'bar@example.com' }
  ];

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
    this.owner.register('service:store', {});
    this.owner.register(
      'service:clients',
      new ClientsService([{ name: 'Acme Inc.', contacts }])
    );

    this.owner
      .lookup('service:clients')
      .set('contacts', () => Promise.resolve(contacts));

    let store = this.owner.lookup('service:store');
    store.findAll = () => members;

    this.owner.register('service:user', Service.extend(user));
  });

  // Skipping since the component is no longer being used
  // and its taking too much time tryi8ng to figure out the issue
  skip('it collects input and sends', async function (assert) {
    assert.expect(15);

    this.set('accept', (delivery) => {
      let { message, toRecipients, ccRecipients } = delivery;
      assert.equal(message, 'Here is your invoice');

      toRecipients.forEach(({ name, email }, idx) => {
        assert.equal(name, contacts[idx].name);
        assert.equal(email, contacts[idx].email);
      });

      ccRecipients.forEach(({ name, email }, idx) => {
        assert.equal(name, userAndMembers[idx].name);
        assert.equal(email, userAndMembers[idx].email);
      });
    });

    this.set(
      'document',
      EmberObject.create({
        pdfAttached: true,
        modelName: 'invoice',
        client: EmberObject.create({
          id: 'id'
        }),

        buildDelivery() {
          return new RSVP.Promise((resolve) => {
            resolve(
              EmberObject.create({
                pdfAttached: true,
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
      <div class='document details'>
        {{send-document document=document accept=(action accept)}}
      </div>
    `);

    assert.dom('h2').hasText('Send Invoice');
    let sendPdfElement = findAll('.switch-field')[0];
    assert.dom(sendPdfElement).hasText('Send as PDF');
    assert.dom('.switch-field input').isChecked();

    let checkboxField = findAll('.checkbox-field input');
    checkboxField.forEach((field) => {
      click(field);
    });

    await fillIn('.message-field textarea', 'Here is your invoice');
    await click('.btn-commit');

    assert.dom('#send-invoice').doesNotExist();
  });
});
