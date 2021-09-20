import Controller from '@ember/controller';
import ModalController from 'frontend/mixins/controllers/modal';
import { inject as service } from '@ember/service';

export default Controller.extend(ModalController, {
  embeddedContent: null,
  tax: service(),

  async init() {
    this._super();
    this.set('taxes', await this.tax.queryTaxes());
  },

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
