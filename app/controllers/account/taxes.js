import Controller from '@ember/controller';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ListBase from 'frontend/mixins/list-base';

export default Controller.extend(ListBase, {
  modals: service(),
  successTitle: 'Success',
  successMessage: 'Tax deleted successfully.',
  taxPresent: notEmpty('model'),

  actions: {
    addTax() {
      let tax = this.addTax();
      this.modals.open('tax-form', { model: tax });
    },

    editTax(tax) {
      this.modals.open('tax-form', { model: tax });
    },

    destroyTax(tax) {
      this.modals.open('confirm-modal', {
        model: tax,
        controller: 'modals.confirm-modal',
        headerTitle: 'Delete Tax',
        title: `Are you sure to delete ${tax.name}?`,
        message: 'You cannot undo this action.',
        confirmButtonLabel: 'Delete tax',
        cancelButtonLabel: 'Keep tax',
        isConfirmButtonStyleDanger: true,
        confirm: () => this.delete.perform(tax)
      });
    }
  }
});
