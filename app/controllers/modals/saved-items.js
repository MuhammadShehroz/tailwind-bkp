import Controller from '@ember/controller';
import ModalController from 'frontend/mixins/controllers/modal';

export default Controller.extend(ModalController, {
  embeddedContent: null,

  actions: {
    dismiss() {
      this.embeddedContent.send('cancel');
    },

    load() {
      this.embeddedContent.send('load');
    }
  }
});
