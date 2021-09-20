import Component from '@ember/component';
import FormBase from 'frontend/mixins/form-base';

export default Component.extend(FormBase, {
  tagName: 'form',
  novalidate: true,
  title: 'Successfully saved',
  message: 'Domain added successfully.',
  attributeBindings: ['novalidate'],

  saveChain() {
    return this.model.save().then(() => {
      this.refresh();
      this.flashMessages.add({
        type: 'success',
        title: this.title,
        message: this.message,
        timeout: this.defaultTimeout
      });
    });
  }
});
