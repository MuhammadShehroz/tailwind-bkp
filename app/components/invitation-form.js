import { set } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import FormBase from 'frontend/mixins/form-base';

export default Component.extend(FormBase, {
  tagName: 'form',
  novalidate: true,
  validations: alias('model.validations.attrs'),
  attributeBindings: ['novalidate'],
  classNames: ['invitation-form'],
  store: service(),
  validationsEnabled: false,

  init() {
    this._super(...arguments);
    set(this, 'model', this.store.createRecord('invitation'));
  },

  saveChain(options) {
    return this.model.save(options).then(() => {
      this.flashMessages.add({
        type: 'success',
        title: 'Invitation sent',
        message: 'Your invitation has been sent to the recipient',
        timeout: this.defaultTimeout
      });
      this.close();
    });
  },

  submit(event) {
    event.preventDefault();
    this.save.perform(this.model);
  },

  actions: {
    cancel() {
      this.close();
    }
  }
});
