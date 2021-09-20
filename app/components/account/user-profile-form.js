import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { alias } from '@ember/object/computed';
import FormBase from 'frontend/mixins/form-base';

export default Component.extend(FormBase, {
  tagName: 'form',
  title: 'Profile saved',
  novalidate: true,
  attributeBindings: ['novalidate'],
  validations: alias('model.validations.attrs'),

  sendVerificationLink: task(function* () {
    yield this.model.resendVerification();
    this.flashMessages.add({
      type: 'success',
      title: 'Success',
      message: 'Verification email sent.',
      timeout: this.defaultTimeout
    });
  }).drop(),

  saveChain() {
    let attrs = this.model.changedAttributes();
    let message = 'Profile successfully saved.';
    if (Object.keys(attrs).includes('email')) {
      this.set(
        'message',
        `A verification email has been sent to ${this.model.email}. You will need to verify this email address before it is updated here on your profile.`
      );
    } else {
      this.set('message', message);
    }

    return this.model.save().then(() => {
      this.flashMessages.add({
        type: 'success',
        title: this.title,
        message: this.message,
        timeout: this.defaultTimeout
      });
    });
  },

  actions: {
    cancel() {
      this.model.rollbackAttributes();
    },

    reloadUser() {
      this.model.reload();
    },

    removeAvatar() {
      this.removeAvatar();
    }
  }
});
