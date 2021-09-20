import Component from '@ember/component';
import ListBase from 'frontend/mixins/list-base';
import { notEmpty } from '@ember/object/computed';

export default Component.extend(ListBase, {
  successMessage: 'Tax deleted successfully.',

  taxPresent: notEmpty('model'),

  deleteChain(model, options) {
    return model.destroyRecord(options).then(() => {
      this.flashMessages.add({
        type: 'success',
        title: this.successTitle,
        message: this.successMessage,
        timeout: this.actionTimeout,
        componentName: 'flash-messages/undo-button',
        componentContent: 'Undo tax delete',
        componentAction: () => this.restore.perform(model)
      });
      return Promise.resolve();
    });
  },

  actions: {
    cancel() {
      this._super();
      this.tax?.rollbackAttributes();
      this.close();
    },

    addTax() {
      this.set('tax', this.createTax());
    },

    editTax(tax) {
      this.set('tax', tax);
    },

    delete(tax) {
      if (this.tax === tax) {
        this.set('tax', null);
      }

      this._super(tax);
    }
  }
});
