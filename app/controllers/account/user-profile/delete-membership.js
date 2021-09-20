import Controller from '@ember/controller';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ListBase from 'frontend/mixins/list-base';
import { InvalidError } from '@ember-data/adapter/error';
import Breadcrumbs from 'frontend/mixins/controllers/breadcrumbs';
import InvalidErrorWrapper from 'frontend/utils/errors/invalid-error';

export default Controller.extend(Breadcrumbs, ListBase, {
  organizationMembership: service(),

  successMessage: 'Membership deleted successfully.',
  memberSinceDate: readOnly('organizationMembership.current.createdAt'),
  isWarningConfirmed: false,

  deleteChain(model, options) {
    return model.destroyRecord(options).then(
      () => {
        this.transitionToRoute('accounts');
        this.flashMessages.add({
          type: 'success',
          title: this.successTitle,
          message: this.successMessage,
          timeout: this.defaultTimeout
        });
        return Promise.resolve();
      },
      (error) => {
        if (error instanceof InvalidError) {
          throw new InvalidErrorWrapper(error);
        } else {
          return Promise.reject(error);
        }
      }
    );
  },

  actions: {
    confirmWarning() {
      this.set('isWarningConfirmed', true);
    },

    delete() {
      this.model.rollbackAttributes();
      this.set('confirm.validationsEnabled', true);
      this.confirm.validateSync();
      document.querySelectorAll('input').forEach((input) => {
        input.focus();
        input.blur();
      });
      if (this.confirm.validations.isValid) {
        this.delete.perform(this.model, {
          adapterOptions: { password: this.confirm.password }
        });
      }
    }
  }
});
