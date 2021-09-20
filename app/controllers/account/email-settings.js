import { task } from 'ember-concurrency';
import Controller from '@ember/controller';
import ListBase from 'frontend/mixins/list-base';
import { inject as service } from '@ember/service';
import { notEmpty, reads } from '@ember/object/computed';

export default Controller.extend(ListBase, {
  modals: service(),
  successTitle: 'Success',
  successMessage: 'Email deleted successfully',
  customDomainPresent: notEmpty('model'),
  isVerified: reads('model.isVerified'),

  deleteChain(model, options) {
    return model.destroyRecord(options).then(() => {
      this.refresh();
      this.flashMessages.add({
        type: 'success',
        title: this.successTitle,
        message: this.successMessage,
        timeout: this.defaultTimeout
      });
      return Promise.resolve();
    });
  },

  sendTestEmailTask: task(function* () {
    this.loader.startLoading();
    yield this.sendTestEmail(this.model)
      .then(() =>
        this.flashMessages.add({
          type: 'success',
          title: 'Email Test',
          message: 'Test email sent successfully.',
          timeout: this.defaultTimeout
        })
      )
      .finally(() => this.loader.endLoading());
  }).drop(),

  verificationTask: task(function* () {
    this.loader.startLoading();
    yield this.verifyEmail(this.model)
      .then(
        () => {
          this.model.reload();
          this.flashMessages.add({
            type: 'success',
            title: 'Email Test',
            message:
              'Email delivery from ${this.model.email} has been enabled.',

            timeout: this.defaultTimeout
          });
        },
        () =>
          this.flashMessages.add({
            type: 'error',
            title: this.errorTitle,
            message:
              'DNS changes can take from a few minutes up to 48hrs to propagate. Please try again later.',

            timeout: this.defaultTimeout
          })
      )
      .finally(() => this.loader.endLoading());
  }).drop(),

  actions: {
    remove() {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        model: this.model,
        headerTitle: 'Delete Email',
        title: 'Delete This Email?',
        message:
          'This will disable and disconnect your domain and email server.',

        confirmButtonLabel: 'Yes, delete this email',
        confirm: () => this.delete.perform(this.model)
      });
    },

    copy(text) {
      navigator.clipboard.writeText(text).then(
        () =>
          this.flashMessages.add({
            type: 'success',
            title: 'Text Copy',
            message: 'Copied successfully.',
            timeout: this.defaultTimeout
          }),
        (error) =>
          this.flashMessages.add({
            type: 'error',
            title: this.errorTitle,
            message: error,
            timeout: this.defaultTimeout
          })
      );
    }
  }
});
