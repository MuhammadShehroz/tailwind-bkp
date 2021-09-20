import Component from '@ember/component';
import FormBase from 'frontend/mixins/form-base';
import { inject as service } from '@ember/service';
import { alias, reads } from '@ember/object/computed';

export default Component.extend(FormBase, {
  tagName: 'form',
  novalidate: true,
  organization: service(),
  successTitle: 'Item Saved',
  successMessage: 'Item saved successfully.',
  attributeBindings: ['novalidate'],
  validations: alias('model.validations.attrs'),
  currentOrganization: reads('organization.current'),

  saveChain() {
    return this.model.save().then(() => {
      this.flashMessages.add({
        type: 'success',
        title: this.successTitle,
        message: this.successMessage,
        timeout: this.defaultTimeout
      });
      this.close();
    });
  },

  actions: {
    cancel() {
      this._super();
      this.close();
    },

    onCurrencyChange(currency) {
      this.set('model.currency', currency.code);
    }
  }
});
