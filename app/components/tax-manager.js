import BSManagerComponent from 'frontend/components/bs-manager';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { sortByID } from 'frontend/lib/sort-by-id';
import { capitalize } from '@ember/string';
import { A } from '@ember/array';

export default BSManagerComponent.extend({
  tax: service(),
  itemType: 'tax',
  newButtonLabel: 'Add Tax',
  emptyMessage:
    'Create & save your own tax rates with custom labels and apply them to any invoice or line item.',

  items: A(),

  async didInsertElement() {
    this.set('items', await this.tax.queryTaxes());
  },

  filteredItems: computed('items.@each.isDeleted', function () {
    return this.items.reject((item) => item.isDeleted);
  }),

  sortedItems: sortByID('filteredItems.[]'),

  refreshData() {
    this.tax.notifyPropertyChange('reload');
  },

  buildNameForMessage(item) {
    return capitalize(item.get('name'));
  }
});
