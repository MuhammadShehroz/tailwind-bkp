import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

module(
  'Integration | Component | flash-messages/add-contact',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it shows flash to add contact for a person client', async function (assert) {
      let content = EmberObject.create({
        client: EmberObject.create({ isCompany: false })
      });

      assert.expect(1);

      this.set('content', content);

      await render(hbs`{{flash-messages/add-contact content=content}}`);

      assert.equal(
        find('.ember-view').textContent.trim().replace(/\s\s+/g, ' '),
        'You must add an email address to this client before this invoice can be sent.'
      );
    });

    test('it shows flash to add contact for a company client', async function (assert) {
      let content = EmberObject.create({
        client: EmberObject.create({ isCompany: true })
      });

      assert.expect(1);

      this.set('content', content);

      await render(hbs`{{flash-messages/add-contact content=content}}`);

      assert.equal(
        find('.ember-view').textContent.trim().replace(/\s\s+/g, ' '),
        'You must add a contact or an email address to this client before this invoice can be sent.'
      );
    });
  }
);
