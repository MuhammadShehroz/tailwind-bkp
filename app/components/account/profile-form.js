import Component from '@ember/component';
import { isPresent } from '@ember/utils';
import { alias, readOnly } from '@ember/object/computed';
import FormBase from 'frontend/mixins/form-base';

export default Component.extend(FormBase, {
  tagName: 'form',
  title: 'Profile saved',
  message: 'Profile successfully saved.',
  novalidate: true,
  attributeBindings: ['novalidate'],
  validations: alias('model.validations.attrs'),
  billingAddress: readOnly('model.billingAddress'),

  actions: {
    async onCountryChange(country) {
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
      this.model.billingAddress.rollbackAttributes();
      this.model.rollbackAttributes();
      if (isPresent(this.model.billingAddress.country)) {
        this.fetchSubregions(this.model.billingAddress.country);
      }
    },

    reloadOrg() {
      this.model.reload();
    },

    removeLogo() {
      this.removeLogo(this.model.id);
    }
  }
});
