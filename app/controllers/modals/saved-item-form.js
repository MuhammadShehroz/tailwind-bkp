import Controller from '@ember/controller';
import ModalController from 'frontend/mixins/controllers/modal';

export default Controller.extend(ModalController, {
  embeddedContent: null,

  actions: {
    accept() {
      this._super(...arguments);
      if (this.model.afterSaveCallback) {
        this.model.afterSaveCallback();
      }
    },

    dismiss() {
      this._super(...arguments);
    }
  }
});
