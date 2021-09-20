import Component from '@ember/component';
import VirtualTax from 'frontend/models/virtual-tax';
import EmberObject, { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  tax: service(),
  modals: service(),

  taxes: alias('tax.sorted'),

  isNoTaxOptionEnabled: false,

  options: computed(
    'isNoTaxOptionEnabled',
    'taxes.@each.{name,percent}',
    function () {
      let result = null;

      if (!isEmpty(this.taxes)) {
        let taxOptions = this.taxes.map((tax) => {
          return VirtualTax.create({
            entity: tax
          });
        });

        if (this.isNoTaxOptionEnabled) {
          let noTaxOption = EmberObject.create({ nameAndPercent: 'No Tax' });
          taxOptions.unshiftObject(noTaxOption);
        }

        result = taxOptions;
      }

      return result;
    }
  ),

  currentTax: computed(
    'model.calculatedTax.{id,taxName,taxPercent}',
    'model.isTaxDesynchronized',
    'options.[]',
    {
      get() {
        let result = null;

        if (this.model.calculatedTax) {
          if (this.model.isTaxDesynchronized) {
            result = this.model.calculatedTax;
          } else if (this.options) {
            result = this.options.findBy(
              'id',
              `${this.model.calculatedTax.id}`
            );
          }
        }

        return result;
      },

      set(key, value) {
        let result = null;
        if (value.get('name') !== 'No Tax') {
          result = value;
        }

        this.set('model.calculatedTax', result);
        return result;
      }
    }
  ),

  allowVisibleDropdownAndUpdateTaxes() {
    let document = this.document || this.model;
    document.syncTaxes();
  },

  actions: {
    openTaxManager() {
      this.selectPublicAPI.actions.close();
      this.modals.open('add-edit-tax', {
        afterSaveCallback: () => this.allowVisibleDropdownAndUpdateTaxes()
      });
    }
  }
});
