import Component from '@ember/component';
import { not, readOnly, or, bool, alias } from '@ember/object/computed';
import { A } from '@ember/array';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'form',
  novalidate: true,
  attributeBindings: ['novalidate'],
  elementId: 'client',
  validations: alias('model.validations.attrs'),
  inEditMode: not('model.isNew'),
  isCompany: readOnly('model.isCompany'),
  billingAddress: readOnly('model.billingAddress'),

  hasClientDetails: or(
    'model.identifier',
    'billingAddress.country',
    'billingAddress.subregion',
    'billingAddress.city',
    'billingAddress.address1',
    'billingAddress.address2',
    'billingAddress.zip',
    'model.email',
    'model.fax',
    'model.phone',
    'model.taxIdName',
    'model.taxIdNumber',
    'model.website'
  ).readOnly(),

  showClientDetails: bool('hasClientDetails').readOnly(),

  country: computed('countries', 'model.billingAddress.country', function () {
    let countries = this.countries || A();
    return countries.findBy('code', this.model.billingAddress.country);
  }),

  subregion: computed(
    'model.billingAddress.subregion',
    'subregions',
    function () {
      let subregions = this.subregions || A();
      return subregions.findBy('code', this.model.billingAddress.subregion);
    }
  ),

  getValidationErrorMessage(/* validations */) {
    return 'The client is missing required data.';
  },

  getValidationErrorTitle() {
    return 'Client form validation error';
  },

  submit(event) {
    event.preventDefault();
    this.save();
  },

  actions: {
    addContact() {
      this.model.addContact();
    },

    removeItem(item) {
      item.destroyRecord();
    },

    setClientType(index) {
      this.model.set('isCompany', index === 0);
    },

    onTrailingIconClick() {},

    onCountryChange(country) {
      this.set('model.billingAddress.country', country.code);
      if (isPresent(country)) {
        this.set('model.billingAddress.subregion', null);
        this.fetchSubregions(country.code);
      }
    },

    onSubregionChange(subregion) {
      this.set('model.billingAddress.subregion', subregion.id);
    },

    cancel() {
      this.cancel();
    }
  }
});
