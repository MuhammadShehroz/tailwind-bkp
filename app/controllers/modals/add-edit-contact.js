import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import ModalController from 'frontend/mixins/controllers/modal';
import ValidateAndSave from 'frontend/mixins/validate-and-save';
import { readOnly } from '@ember/object/computed';

export default Controller.extend(ModalController, ValidateAndSave, {
  store: service(),
  modals: service(),

  contact: readOnly('model.contact'),

  async save() {
    await this.contact.save();
    this.model.onSave(this.contact);
    this.set('validationsEnabled', false);
    this.close();
  },

  actions: {
    cancel() {
      this.model.onCancel();
      this.set('validationsEnabled', false);
      this.close();
    },

    save() {
      this.set('validationsEnabled', true);
      this.validateAndSave(this.contact);
    }
  }
});
