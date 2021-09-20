import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import FormBase from 'frontend/mixins/form-base';

export default Component.extend(FormBase, {
  tagName: 'form',
  validations: alias('model.validations.attrs'),

  saveChain() {
    return this.model.save().then(() => {
      this.flashMessages.add({
        type: 'success',
        title: this.title,
        message: this.message,
        timeout: this.defaultTimeout
      });
      this.onClose();
      this.reload();
    });
  }
});
