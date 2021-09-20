import Component from '@ember/component';
import FormBase from 'frontend/mixins/form-base';
import { alias } from '@ember/object/computed';

export default Component.extend(FormBase, {
  tagName: 'form',
  novalidate: true,
  successTitle: 'Unit Saved',
  successMessage: 'Unit saved successfully.',
  attributeBindings: ['novalidate'],
  validations: alias('model.validations.attrs'),

  saveChain() {
    return this.model.save().then(() => {
      this.close();
      this.flashMessages.add({
        type: 'success',
        title: this.successTitle,
        message: this.successMessage,
        timeout: this.defaultTimeout
      });
    });
  },

  actions: {
    cancel() {
      this.close();
      this._super();
    }
  }
});
