import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import taxService from '../../helpers/tax-service';
import { selectChoose } from 'ember-power-select/test-support/helpers';

module('Integration | Component | bs-tax-select', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:tax',
      taxService([
        { name: 'Tax1', percent: 1 },
        { name: 'Tax2', percent: 2 }
      ])
    );
  });

  test('it renders', async function (assert) {
    assert.expect(3);

    let model = EmberObject.create({
      tax: null
    });

    this.set('model', model);
    this.set('currentTax', function (tax) {
      return EmberObject.create({
        name: tax.name,
        percent: tax.percent,
        entity: tax
      });
    });

    this.set('taxSetter', function (key, value) {
      this.model.set('tax', value.entity);

      if (value.entity != null) {
        return value;
      }
    });

    this.set('taxObject', function (tax) {
      return EmberObject.create({
        name: tax.name,
        percent: tax.percent,
        entity: tax
      });
    });

    await render(hbs`
      {{#bs-tax-select
        model=model
        currentTax=currentTax
        modelSetter=taxSetter
        taxObject=taxObject
        label='Tax'
        as |tax|}}
        {{tax.name}} {{tax.percent}}
      {{/bs-tax-select}}
    `);

    assert.dom('label').hasText('Tax');
    await selectChoose('.select-field', 'Tax1');

    assert.equal(this.model.tax.get('name'), 'Tax1');

    await selectChoose('.select-field', 'No Tax');

    assert.equal(this.model.tax, null);
  });
});
