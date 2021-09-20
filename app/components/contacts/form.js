import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import FormBase from 'frontend/mixins/form-base';

export default Component.extend(FormBase, {
  tagName: 'form',
  elementId: 'contact',
  novalidate: true,
  attributeBindings: ['novalidate'],
  validations: alias('model.validations.attrs'),

  saveChain() {
    return this.model.save().then(() => {
      this.onSave(true);
      this.flashMessages.add({
        type: 'success',
        title: 'Successfully saved.',
        message: 'Saved successfully',
        timeout: this.defaultTimeout
      });
    });
  }
});
