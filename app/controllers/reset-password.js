import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import FormBase from 'frontend/mixins/form-base';

export default Controller.extend(FormBase, {
  resetPassword: service(),
  validations: alias('model.validations.attrs'),

  header: computed(function () {
    return document.querySelector('.header');
  }),

  saveChain() {
    let { password, passwordConfirmation } = this.model;
    return this.resetPassword
      .changePassword(password, passwordConfirmation, this.token)
      .then(() => {
        this.transitionToRoute('login');
        this.flashMessages.add({
          type: 'success',
          title: 'Your password has been reset.',
          message: 'Please log in with your new password.',
          timeout: this.defaultTimeout
        });
      });
  }
});
