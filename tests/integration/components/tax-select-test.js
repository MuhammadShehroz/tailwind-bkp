import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import EmObject from '@ember/object';

module('Integration | Component | tax-select', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    let arrayOfCalledItems = [];
    this.set('arrayOfCalledItems', arrayOfCalledItems);

    this.owner.register(
      'service:tax',
      Service.extend({
        init() {
          this._super(...arguments);
          this.sorted = [];
        }
      })
    );

    this.owner.register(
      'service:modals',
      Service.extend({
        open(name) {
          arrayOfCalledItems.push({
            funcName: 'service:modals:push',
            arguments: [name]
          });
        }
      })
    );
  });

  test('it renders sensible defaults', async function (assert) {
    this.set('model', {});
    this.set('isNoTaxOptionEnabled', false);

    await render(hbs`
      <TaxSelect
        @model={{model}}
        @isNoTaxOptionEnabled={{isNoTaxOptionEnabled}}
      />
    `);

    assert.dom('.ember-power-select-placeholder').exists({ count: 1 });
    assert.dom('.ember-power-select-placeholder').hasText('Tax (Optional)');

    // Open dropdown
    await click('.ember-power-select-trigger');

    assert
      .dom('.ember-power-select-option--no-matches-message')
      .exists({ count: 1 });
    assert
      .dom('.ember-power-select-option--no-matches-message')
      .hasText('No results found');

    assert.dom('.ember-power-select-trigger-option').exists({ count: 1 });
    assert
      .dom('.ember-power-select-trigger-option')
      .hasText('Add or edit a tax...');
  });

  test('it renders a modal to create a new tax', async function (assert) {
    this.set('model', {});
    this.set('isNoTaxOptionEnabled', false);

    await render(hbs`
      <TaxSelect
        @model={{model}}
        @isNoTaxOptionEnabled={{isNoTaxOptionEnabled}}
      />
    `);

    // Open dropdown
    await click('.ember-power-select-trigger');
    // Click Add or edit a tax...
    await click('.ember-power-select-trigger-option button');

    assert.deepEqual(
      this.arrayOfCalledItems,
      [
        {
          arguments: ['add-edit-tax'],
          funcName: 'service:modals:push'
        }
      ],
      'Expected functions to be called in the right order with'
    );
  });

  test('it renders computed options from model, handles text selection', async function (assert) {
    this.set('model', {});
    this.set('isNoTaxOptionEnabled', false);

    this.taxService = this.owner.lookup('service:tax');
    this.taxService.set(
      'sorted',
      [...Array(5).keys()].map((key) =>
        EmObject.create({
          id: `${key}`,
          name: `Some text ${key}`,
          percent: key * 3
        })
      )
    );

    await render(hbs`
      <TaxSelect
        @model={{model}}
        @isNoTaxOptionEnabled={{isNoTaxOptionEnabled}}
      />
    `);

    // Open dropdown
    await click('.ember-power-select-trigger');
    assert.dom('.ember-power-select-option--no-matches-message').doesNotExist();
    assert.dom('li.ember-power-select-option').exists({ count: 5 });

    assert
      .dom(this.element.querySelectorAll('li.ember-power-select-option')[0])
      .hasText(`Some text 0`);

    this.taxService.sorted
      .filter(({ id }) => id > 0)
      .forEach(({ id }) =>
        assert
          .dom(
            this.element.querySelectorAll('li.ember-power-select-option')[id]
          )
          .hasText(`Some text ${id} (${id * 3}%)`)
      );

    await click(
      this.element.querySelectorAll('li.ember-power-select-option')[2]
    );
    assert.deepEqual(this.model.calculatedTax.id, this.taxService.sorted[2].id);
  });

  test('it renders no tax option and ignore selection', async function (assert) {
    this.set('model', {});
    this.set('isNoTaxOptionEnabled', true);

    this.taxService = this.owner.lookup('service:tax');
    this.taxService.set(
      'sorted',
      [...Array(5).keys()].map((key) =>
        EmObject.create({
          id: `${key}`,
          name: `Some text ${key}`,
          percent: key * 3
        })
      )
    );

    await render(hbs`
      <TaxSelect
        @model={{model}}
        @isNoTaxOptionEnabled={{isNoTaxOptionEnabled}}
      />
    `);

    // Open dropdown
    await click('.ember-power-select-trigger');
    assert.dom('li.ember-power-select-option').exists({ count: 6 });

    assert
      .dom(this.element.querySelectorAll('li.ember-power-select-option')[0])
      .hasText('No Tax');

    await click(
      this.element.querySelectorAll('li.ember-power-select-option')[0]
    );
    assert.notOk(this.model.calculatedTax);
  });

  test('it renders current tax selection', async function (assert) {
    this.set('isNoTaxOptionEnabled', false);

    this.taxService = this.owner.lookup('service:tax');
    this.taxService.set(
      'sorted',
      [...Array(5).keys()].map((key) =>
        EmObject.create({
          id: `${key}`,
          name: `Some text ${key}`,
          percent: key * 3
        })
      )
    );

    this.set('model', {
      isTaxDesynchronized: false,
      calculatedTax: this.taxService.sorted[2]
    });

    await render(hbs`
      <TaxSelect
        @model={{model}}
        @isNoTaxOptionEnabled={{isNoTaxOptionEnabled}}
      />
    `);

    // Open dropdown
    await click('.ember-power-select-trigger');

    assert
      .dom('li.ember-power-select-option[aria-selected="true"]')
      .exists({ count: 1 });
    assert
      .dom('li.ember-power-select-option[aria-selected="true"]')
      .hasText('Some text 2 (6%)');
    assert
      .dom('li.ember-power-select-option[aria-selected="false"]')
      .exists({ count: 4 });
  });
});
