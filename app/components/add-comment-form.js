import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import FormBase from 'frontend/mixins/form-base';

export default Component.extend(FormBase, {
  tagName: 'form',
  validations: alias('model.validations.attrs'),

  submit(event) {
    event.preventDefault();
    this.save.perform(this.document);
  },

  didInsertElement() {
    this.set('model', this.newComment());
    this.element.querySelector('textarea').focus();
    this.element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  },

  saveChain(options) {
    return this.model.save(options).then(() => {
      this.afterSave();
      this.flashMessages.add({
        type: 'success',
        title: 'Comment added',
        message: 'Comment added.',
        timeout: this.defaultTimeout
      });
      this.set('model', this.newComment());
    });
  },

  actions: {
    cancel() {
      this.model.rollbackAttributes();
      this.close();
    }
  }
});
