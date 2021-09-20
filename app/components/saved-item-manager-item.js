import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  showRemove: true,
  showConflict: true,
  isSelectable: false,
  isConflictPresent: or(
    'isIncompatibleCurrency',
    'isIncompatibleTaxDistribution'
  ),

  isSelected: computed('selectedItems.[]', 'model', function () {
    return this.selectedItems.includes(this.model);
  }),

  isIncompatibleCurrency: computed(
    'documentCurrency',
    'model.currency',
    function () {
      return (
        this.documentCurrency != null &&
        this.model.currency !== this.documentCurrency
      );
    }
  ),

  isIncompatibleTaxDistribution: computed(
    'documentTaxDistribution',
    'model.taxDistribution',
    function () {
      let result = false;
      if (this.documentTaxDistribution !== this.model.taxDistribution) {
        result = true;
      }

      return result;
    }
  ),

  actions: {
    check() {
      this.toggleSelection(this.model);
    },

    delete() {
      this.delete(this.model);
    }
  }
});
