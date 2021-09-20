import Controller from '@ember/controller';
import ModalController from 'frontend/mixins/controllers/modal';
import { readOnly } from '@ember/object/computed';

export default Controller.extend(ModalController, {
  item: readOnly('model'),
  cancelButtonLabel: 'Cancel',
  confirmButtonLabel: 'Confirm',

  actions: {
    confirm() {
      this.confirm();
      this.close();
    },

    cancel() {
      this.close();
    }
  }
});
