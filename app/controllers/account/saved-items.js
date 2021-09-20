import Controller from '@ember/controller';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ListBase from 'frontend/mixins/list-base';

export default Controller.extend(ListBase, {
  modals: service(),
  successTitle: 'Success',
  successMessage: 'Item deleted successfully',
  itemPresent: notEmpty('model'),

  actions: {
    addItem() {
      let item = this.addItem();
      this.modals.open('saved-item-form', {
        model: item,
        units: this.units,
        currencies: this.currencies,
        controller: 'modals.saved-item-form'
      });
    },

    editItem(item) {
      this.modals.open('saved-item-form', {
        model: item,
        units: this.units,
        currencies: this.currencies,
        controller: 'modals.saved-item-form'
      });
    },

    destroyItem(item) {
      this.modals.open('confirm-modal', {
        model: item,
        controller: 'modals.confirm-modal',
        headerTitle: 'Delete Item',
        title: `Are you sure to delete ${item.name}?`,
        message: 'You cannot undo this action.',
        confirmButtonLabel: 'Delete Item',
        cancelButtonLabel: 'Keep Item',
        isConfirmButtonStyleDanger: true,
        confirm: () => this.delete.perform(item)
      });
    }
  }
});
