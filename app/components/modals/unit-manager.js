import Component from '@ember/component';
import ListBase from 'frontend/mixins/list-base';
import { notEmpty } from '@ember/object/computed';

export default Component.extend(ListBase, {
  successMessage: 'Unit deleted successfully.',

  unitPresent: notEmpty('model'),

  deleteChain(model, options) {
    return model.destroyRecord(options).then(() => {
      this.flashMessages.add({
        type: 'success',
        title: this.successTitle,
        message: this.successMessage,
        timeout: this.actionTimeout,
        componentName: 'flash-messages/undo-button',
        componentContent: 'Undo unit delete',
        componentAction: () => this.restore.perform(model)
      });
      return Promise.resolve();
    });
  },

  actions: {
    cancel() {
      this._super();
      this.unit?.rollbackAttributes();
      this.close();
    },

    addUnit() {
      this.set('unit', this.createUnit());
    },

    editUnit(unit) {
      this.set('unit', unit);
    },

    delete(unit) {
      if (this.unit === unit) {
        this.set('unit', null);
      }

      this._super(unit);
    }
  }
});
