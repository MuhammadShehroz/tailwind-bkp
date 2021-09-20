import { computed } from '@ember/object';
import Controller from '@ember/controller';
import ListBase from 'frontend/mixins/list-base';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { InvalidError } from '@ember-data/adapter/error';
import Breadcrumbs from 'frontend/mixins/controllers/breadcrumbs';
import InvalidErrorWrapper from 'frontend/utils/errors/invalid-error';

export default Controller.extend(Breadcrumbs, ListBase, {
  session: service(),
  organizationMembership: service(),

  successMessage: 'Profile deleted successfully.',
  memberSinceDate: readOnly('organizationMembership.current.createdAt'),
  isWarningConfirmed: false,

  documents: computed(
    'documentCount.{approvedEstimates,closedInvoices,declinedEstimates,draftDocuments,openDocuments,recurringInvoices}',
    function () {
      if (!this.documentCount) {
        return [];
      }

      return [
        {
          name: 'Open invoice & estimates',
          count: this.documentCount.openDocuments
        },
        {
          name: 'Draft invoices & estimates',
          count: this.documentCount.draftDocuments
        },
        {
          name: 'Closed invoices',
          count: this.documentCount.closedInvoices
        },
        {
          name: 'Approved estimates',
          count: this.documentCount.approvedEstimates
        },
        {
          name: 'Declined estimates',
          count: this.documentCount.declinedEstimates
        },
        {
          name: 'Recurring invoices',
          count: this.documentCount.recurringInvoices
        }
      ];
    }
  ),

  deleteChain(model, options) {
    return model.destroyRecord(options).then(
      () => {
        this.session.set('data.organizationId', null);
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
