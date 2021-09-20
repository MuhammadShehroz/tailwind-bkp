import Controller from '@ember/controller';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ListBase from 'frontend/mixins/list-base';

export default Controller.extend(ListBase, {
  modals: service(),
  successTitle: 'Success',
  successMessage: 'Unit deleted successfully.',
  unitPresent: notEmpty('model'),

  actions: {
    addUnit() {
      let unit = this.addUnit();
      this.modals.open('unit-form', { model: unit });
    },

    editUnit(unit) {
      this.modals.open('unit-form', { model: unit });
    },

    destroyUnit(unit) {
      this.modals.open('confirm-modal', {
        model: unit,
        controller: 'modals.confirm-modal',
        headerTitle: 'Delete Unit',
        title: `Are you sure to delete ${unit.name}?`,
        message: 'You cannot undo this action.',
        confirmButtonLabel: 'Delete unit',
        cancelButtonLabel: 'Keep unit',
        isConfirmButtonStyleDanger: true,
        confirm: () => this.delete.perform(unit)
      });
    }
  }
});
