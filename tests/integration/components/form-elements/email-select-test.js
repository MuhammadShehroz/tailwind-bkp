import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | form-elements/email-select',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      this.setProperties({
        users: [
          {
            id: 10,
            name: 'Thomas A. Wilson',
            email: 'ThomasAWilson@dayrep.com'
          },
          { id: 11, name: 'Stella D. Hahne', email: 'StellaDHahne@dayrep.com' },
          {
            id: 12,
            name: 'Maurice T. Pratt',
            email: 'MauriceTPratt@teleworm.us'
          },
          { id: 13, name: 'Celina A. Minor', email: 'CelinaAMinor@dayrep.com' }
        ],

        recipients: [],
        optionLabel: 'name',
        displayField: 'name',
        id: 'id'
      });

      await render(hbs`
      <FormElements::EmailSelect
        @options={{users}}
        @optionKey={{id}}
        @optionLabel={{optionLabel}}
        @displayField='name'
        @value={{recipients}}
      />
    `);
      assert.dom('tw-badge').doesNotExist();
      await click('.ember-power-select-trigger');
      assert.dom('.ember-power-select-option').exists({ count: 4 });
      assert
        .dom('.ember-power-select-option:nth-child(1)')
        .hasText(this.users[0][this.optionLabel]);
      await click('.ember-power-select-option:nth-child(1)');
      assert.equal(this.recipients.length, 1, 'Has one user selected');
      assert.dom('.tw-badge').exists();
      assert
        .dom('.tw-badge:nth-child(1)')
        .includesText(this.users[0][this.displayField]);
      await click('.ember-power-select-trigger');
      assert.dom('.ember-power-select-option').exists({ count: 3 });

      await click('.ember-power-select-option:nth-child(2)');
      assert.equal(this.recipients.length, 2, 'Yet one user selected');
      assert
        .dom('.tw-badge:nth-child(2)')
        .includesText(this.users[2][this.displayField]);
      await click('.ember-power-select-trigger');
      assert.dom('.ember-power-select-option').exists({ count: 2 });

      await click('.tw-badge:nth-child(2) button');
      assert.equal(this.recipients.length, 1, 'Remove the last user');
      await click('.ember-power-select-trigger');
      assert.dom('.ember-power-select-option').exists({ count: 3 });
      assert.dom('.tw-badge').exists({ count: 1 });
    });
  }
);
