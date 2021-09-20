import Component from '@ember/component';
import FormBase from 'frontend/mixins/form-base';
import DocumentDefaults from 'frontend/mixins/components/forms/document-defaults-options';
import { readOnly, alias, reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { A } from '@ember/array';

const currencyFormats = [
  { key: 'symbol_first', label: 'Symbol first (e.g. $1.00)' },
  { key: 'symbol_first_space', label: 'Symbol first w/ space (e.g. $ 1.00)' },
  { key: 'symbol_last', label: 'Symbol last (e.g. 1.00$)' },
  { key: 'symbol_last_space', label: 'Symbol last w/ space (e.g. 1.00 $)' },
  { key: 'code_first', label: 'Code first (e.g. USD1.00)' },
  { key: 'code_first_space', label: 'Code first w/ space (e.g. USD 1.00)' },
  { key: 'code_last', label: 'Code last (e.g. 1.00USD)' },
  { key: 'code_last_space', label: 'Code last w/ space (e.g. 1.00 USD)' }
];

const decimalsSeparators = [
  { key: ',', label: 'Comma' },
  { key: '.', label: 'Period' },
  { key: ' ', label: 'Space' },
  { key: '', label: 'None' }
];

const decimals = [
  { key: 0, label: 'None (e.g. 1)' },
  { key: 1, label: 'One (e.g. 1.0)' },
  { key: 2, label: 'Two (e.g. 1.00)' },
  { key: 3, label: 'Three (e.g. 1.000)' },
  { key: 4, label: 'Four (e.g. 1.0000)' }
];

export default Component.extend(FormBase, DocumentDefaults, {
  tagName: 'form',
  novalidate: true,
  message: 'Preferences saved successfully.',
  attributeBindings: ['novalidate'],

  tax: service(),
  modals: service(),
  organization: service(),
  taxDistribution: service(),
  lateFeeService: service('late-fee'),

  currentOrganization: reads('organization.current'),
  paymentTerms: reads('terms.paymentTerms'),
  lateFeeOptions: alias('lateFeeService.lateFeeOptions'),
  intervalOptions: readOnly('lateFeeService.lateFeeIntervals'),
  billingAddress: readOnly('model.billingAddress'),

  dateFormat: computed('dateFormats', 'model.dateFormat', function () {
    return this.dateFormats.findBy('key', this.model.dateFormat);
  }),

  currencyFormats,

  currencyFormat: computed(
    'currencyFormats',
    'model.currencyFormat',
    function () {
      return this.currencyFormats.findBy('key', this.model.currencyFormat);
    }
  ),

  decimalsSeparators,

  decimalsSeparator: computed(
    'decimalsSeparators',
    'model.decimalsSeparator',
    function () {
      return this.decimalsSeparators.findBy(
        'key',
        this.model.decimalsSeparator
      );
    }
  ),

  thousandsSeparators: alias('decimalsSeparators'),

  thousandsSeparator: computed(
    'thousandsSeparators',
    'model.thousandsSeparator',
    function () {
      return this.thousandsSeparators.findBy(
        'key',
        this.model.thousandsSeparator
      );
    }
  ),

  decimals,

  quantityDecimal: computed('decimals', 'model.quantityDecimals', function () {
    return this.decimals.findBy('key', this.model.quantityDecimals);
  }),

  decimal: computed('decimals', 'model.decimals', function () {
    return this.decimals.findBy('key', this.model.decimals);
  }),

  dueDate: computed('paymentTerms', 'model.netTerms', function () {
    return this.paymentTerms.findBy('value', this.model.netTerms);
  }),

  selectedTaxDistribution: computed(
    'taxDistributionOptions',
    'model.taxDistribution',
    function () {
      return this.taxDistributionOptions.findBy(
        'value',
        this.model.taxDistribution
      );
    }
  ),

  timezone: computed('timezones', 'model.timezone', function () {
    let timezones = this.timezones || A();
    return timezones.findBy('key', this.model.timezone);
  }),

  unit: computed('units', 'model.unitOfMeasurement', function () {
    let units = this.units || A();
    return units.findBy('key', this.model.unitOfMeasurement);
  }),

  actions: {
    async onCountryChange(country) {
      this.model.set('billingAddress.country', country.code);
      if (isPresent(country)) {
        this.model.set('billingAddress.subregion', null);
        this.fetchSubregions(country.code);
      }
    },

    onSubregionChange(subregion) {
      this.set('model.billingAddress.subregion', subregion.id);
    },

    onSelect(key, value, option) {
      this.model.set(value, option[key]);
    },

    addTax() {
      let tax = this.addTax();
      this.modals.open('tax-form', { model: tax });
    },

    cancel() {
      this.model.billingAddress.rollbackAttributes();
      this.model.rollbackAttributes();
      if (isPresent(this.model.billingAddress.country)) {
        this.fetchSubregions(this.model.billingAddress.country);
      }
    }
  }
});
