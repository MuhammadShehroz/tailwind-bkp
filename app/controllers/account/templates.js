import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  modals: service(),

  actions: {
    editMessage(templateName, instanceName, messageType, message) {
      this.modals.open('template-modal', {
        model: this.model,
        preview: this.preview,
        controller: 'modals.template-modal',
        templateName,
        instanceName,
        messageType,
        message
      });
    }
  }
});
