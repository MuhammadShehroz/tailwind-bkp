import Controller from '@ember/controller';
import { readOnly } from '@ember/object/computed';
import { capitalize } from '@ember/string';
import ModalController from 'frontend/mixins/controllers/modal';

export default Controller.extend(ModalController, {
  organization: readOnly('model.model'),

  init() {
    this._super(...arguments);
    this.organizationMessageAttribute = {
      invoiceReminder: 'reminderMessage'
    };
  },

  actions: {
    appendTag(tag) {
      let {
        organization,
        cursorPosition = 0,
        model: { templateName }
      } = this;
      let { [templateName]: template = '' } = organization;
      let newTemplate = [
        template.slice(0, cursorPosition),
        tag,
        template.slice(cursorPosition)
      ].join('');
      this.set(`organization.${templateName}`, newTemplate);
      this.send('setCursorPosition', newTemplate.length);
    },

    setCursorPosition(cursorPosition) {
      this.set('cursorPosition', cursorPosition);
    },

    resetDefault() {
      let instanceType = `${this.instanceName}${capitalize(this.messageType)}`;
      let associatedAttribute =
        this.organizationMessageAttribute[instanceType] || instanceType;

      this.model.set(
        associatedAttribute,
        this.model.get(`default${capitalize(associatedAttribute)}`) || ''
      );
    }
  }
});
