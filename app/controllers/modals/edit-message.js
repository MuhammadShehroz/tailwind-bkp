import Controller from '@ember/controller';
import ModalController from 'frontend/mixins/controllers/modal';
import { reads } from '@ember/object/computed';

export default Controller.extend(ModalController, {
  embeddedContent: null,
  message: reads('model.message'),

  init() {
    this._super(...arguments);
    this.modals.on('open', (modal) => {
      if (modal.name === 'edit-message') {
        this.set('message', modal.model.message);
      }
    });
  },

  willDestroy() {
    this.modals.off('open');
    this._super(...arguments);
  },

  actions: {
    accept() {
      this.model.onAccept(this.message);
    }
  }
});
