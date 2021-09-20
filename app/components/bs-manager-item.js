import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['bs-manager-item'],
  classNameBindings: ['isEditMode'],
  model: null,
  selectedItem: null,
  isEditButtonDisabled: false,
  isRemoveButtonDisabled: false,

  isEditMode: computed('model', 'selectedItem', function () {
    return this.model === this.selectedItem;
  }),

  actions: {
    edit() {
      this.edit(this.model);
    },

    delete() {
      this.delete(this.model);
    },

    cancelEdit() {
      this.cancelEdit();
    },

    save() {
      this.save();
    }
  }
});
