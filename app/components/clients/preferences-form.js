import { A } from '@ember/array';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias, reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import FormBase from 'frontend/mixins/form-base';

export default Component.extend(FormBase, {
  tagName: 'form',
  novalidate: true,
  attributeBindings: ['novalidate'],
  message: 'Client preferences saved successfully.',
  validations: alias('model.validations.attrs'),

  terms: service(),
  modals: service(),
  organization: service(),
  taxDistributionService: service('taxDistribution'),

  currentOrganization: reads('organization.current'),
  taxDistributionOptions: reads('taxDistributionService.options'),
  paymentTerms: reads('terms.paymentTerms'),
  taxPlaceholder: reads('currentOrganization.tax.nameAndPercent'),
  taxDistributionPlaceholder: reads('currentOrganization.taxDistributionLabel'),
  lateFeePlaceholder: reads('currentOrganization.lateFeeLabel'),

  isOrganizationStripeConnected: reads('currentOrganization.isStripeConnected'),
  isOrganizationPaypalConnected: reads('currentOrganization.isPaypalConnected'),
  isOrganizationCoinbaseConnected: reads(
    'currentOrganization.isCoinbaseConnected'
  ),

  dueDate: computed('paymentTerms.[]', 'model.netTerms', function () {
    let paymentTerms = this.paymentTerms || A();
    return paymentTerms.findBy('value', this.model.netTerms);
  }),

  taxDistribution: computed(
    'taxDistributionOptions.[]',
    'model.taxDistribution',
    function () {
      let taxDistributionOptions = this.taxDistributionOptions || A();
      return taxDistributionOptions.findBy('value', this.model.taxDistribution);
    }
  ),

  includeStripe: computed(
    'model.includeStripe',
    'currentOrganization.includeStripe',
    {
      get() {
        let { includeStripe } = this.model;

        if (includeStripe === null) {
          return this.currentOrganization.includeStripe;
        }

        return includeStripe;
      },

      set(key, value) {
        this.model.set('includeStripe', value);
        return value;
      }
    }
  ),

  includePaypal: computed(
    'model.includePaypal',
    'currentOrganization.includePaypal',
    {
      get() {
        let { includePaypal } = this.model;

        if (includePaypal === null) {
          return this.currentOrganization.includePaypal;
        }

        return includePaypal;
      },

      set(key, value) {
        this.model.set('includePaypal', value);
        return value;
      }
    }
  ),

  actions: {
    reset() {
      let attributes = [
        'currency',
        'unitPrice',
        'netTerms',
        'shipping',
        'taxDistribution',
        'hasLateFee',
        'lateFeeKind',
        'lateFeeInterval',
        'lateFee',
        'pdfAttached'
      ];
      attributes.forEach((attribute) =>
        this.model.set(attribute, this.currentOrganization.get(attribute))
      );
      let associations = ['unitOfMeasurement', 'tax'];
      associations.forEach((association) =>
        this.model.set(association, this.currentOrganization.get(association))
      );
    },

    openTaxManager() {
      this.modals.open('tax-manager', {
        model: this.taxes,
        controller: 'modals.tax-manager',
        createTax: this.createTax
      });
    },

    openUnitManager() {
      this.modals.open('unit-manager', {
        model: this.units,
        controller: 'modals.unit-manager',
        createUnit: this.createUnit
      });
    },

    onCurrencySelect(value) {
      this.model.set('currency', value.get('code'));
    },

    onDueDateSelect(value) {
      this.model.set('netTerms', value.get('value'));
    },

    onTaxDistributionSelect(value) {
      this.model.set('taxDistribution', value.get('value'));
    }
  }
});
