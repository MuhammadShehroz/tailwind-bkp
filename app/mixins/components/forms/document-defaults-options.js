import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';

export default Mixin.create({
  terms: service(),
  taxDistributionService: service('taxDistribution'),

  paymentTerms: reads('terms.paymentTermsForPreferences'),
  paymentDueDate: computed('model.netTerms', 'paymentTerms', {
    get() {
      if (this.model.netTerms == null) {
        return;
      }

      return this.terms.findTermByType(this.model.netTerms, true);
    },

    set(key, value) {
      this.model.set('netTerms', value.value);

      return value;
    }
  }),

  taxObject(tax) {
    return EmberObject.create({
      name: tax.name,
      percent: tax.percent,
      entity: tax
    });
  },

  currentTax(tax) {
    if (tax) {
      this.updateTaxFields(tax);
      return tax;
    }

    return EmberObject.create({
      name: this.model.tax.name,
      percent: this.model.tax.name,
      entity: this.model.tax
    });
  },

  updateTaxFields(tax) {
    let taxFieldsEdited =
      this.model.taxName !== tax.name || this.model.taxPercent !== tax.percent;
    if (this.autoUpdateTax && taxFieldsEdited) {
      this.set('autoUpdateTax', false);
    }
  },

  taxSetter(key, value) {
    if (value.entity) {
      this.model.set('tax', value.entity);
      return value;
    } else {
      this.model.set('tax', null);
      return null;
    }
  },

  taxDistributionOptions: computed(
    'taxDistributionService.options',
    'model.taxDistribution',
    function () {
      let options = [...this.taxDistributionService.options];
      if (this.model.taxDistribution == null) {
        let noneOption = options.findBy('label', 'None');
        options.removeObject(noneOption);
      }

      return options;
    }
  ),

  taxDistribution: computed('model', 'taxDistributionOptions', {
    get() {
      let { taxDistribution } = this.model;

      if (taxDistribution) {
        return this.taxDistributionOptions.findBy('value', taxDistribution);
      }

      return undefined;
    },

    set(key, value) {
      if (value.label === 'None') {
        this.model.setProperties({
          taxDistribution: null,
          tax: null
        });

        return;
      } else {
        this.model.set('taxDistribution', value.value);
      }

      return value;
    }
  })
});
