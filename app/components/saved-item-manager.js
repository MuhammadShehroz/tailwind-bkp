import BSManagerComponent from 'frontend/components/bs-manager';
import PaginationInfo from 'frontend/mixins/pagination-info';
import { computed, set } from '@ember/object';
import { capitalize } from '@ember/string';
import { inject as service } from '@ember/service';
import { equal, reads, or, notEmpty, and } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';

const selectedItems = [];

export default BSManagerComponent.extend(PaginationInfo, {
  classNames: ['saved-item-manager'],
  store: service(),
  savedItem: service(),

  pagination: reads('items.meta.pagination'),
  hasSearch: or('hasPages', 'isTextSearchDisplayForced'),
  isDocumentCurrencyPresent: notEmpty('document.currency'),
  isDocumentTaxDistributionPresent: notEmpty('document.taxDistribution'),
  isDocumentCurrencyOrTaxDistributionPresent: or(
    'isDocumentCurrencyPresent',
    'isDocumentTaxDistributionPresent'
  ),

  isConflictSliderDisplayed: and(
    'isEmbedded',
    'isDocumentCurrencyOrTaxDistributionPresent'
  ),

  itemType: 'saved-item',

  selectedItems,
  loadSelectedItems: () => {},

  document: null,

  items: computed(
    'params.{page.number,text,currency,tax_distribution}',
    function () {
      return this.savedItem.query(this.params);
    }
  ),

  selectionIsEmpty: equal('selectedItems.length', 0),

  isConflictHidden: computed('params.{currency,tax_distribution}', {
    get() {
      return (
        this.params.currency !== null || this.params.tax_distribution !== null
      );
    },

    set(key, value) {
      if (value) {
        this.set('params.currency', this.document?.currency);
        this.set('params.tax_distribution', this.document?.taxDistribution);
      } else {
        this.set('params.currency', null);
        this.set('params.tax_distribution', null);
      }

      return value;
    }
  }),

  init() {
    this._super(...arguments);

    set(this, 'params', {
      page: { number: 1, size: 10 },
      text: '',
      currency: this.document?.currency,
      // eslint-disable-next-line camelcase
      tax_distribution: this.document?.taxDistribution
    });
    this.searchText = '';
    set(this, 'isTextSearchDisplayForced', false);
    this.set('selectedItems', []);
  },

  refreshData() {
    this.notifyPropertyChange('items');
  },

  reset() {
    this._super();
    this.set('selectedItems', []);
  },

  findByText: task(function* () {
    yield timeout(600);
    this.setProperties({
      'params.text': this.searchText,
      'params.page.number': 1
    });
  }).restartable(),

  toggleSelectedItem(item) {
    if (this.selectedItems.includes(item)) {
      this.selectedItems.removeObject(item);
    } else {
      this.selectedItems.addObject(item);
    }
  },

  buildNameForMessage(item) {
    let quantity = item.quantity || '';
    let uom = item.unitOfMeasurement.get('name') || '';
    let name = item.name || '';
    let nameForMessage = `${quantity} ${uom} ${name}`;

    return nameForMessage;
  },

  delete(item) {
    this.flashMessages.clearMessages();
    item.destroyRecord().then(() => {
      item.unloadRecord();
      this.refreshData();
      this.flashMessages.add({
        type: 'success',
        timeout: this.defaultTimeout,
        title: `Delete ${capitalize(this.itemType)}`,
        message: `"${this.buildNameForMessage(item)}" is deleted.`,
        componentName: 'flash-messages/undo-button',
        componentContent: 'Undo item',
        componentAction: () => this.restore(item)
      });
    });
    if (this.selectedItems.includes(item)) {
      this.selectedItems.removeObject(item);
    }
  },

  restore(destroyedItem) {
    this.flashMessages.clearMessages();
    if (destroyedItem) {
      let id = destroyedItem.get('id');
      this.store
        .restoreRecord(this.itemType, id)
        .then((item) => {
          this.flashMessages.add({
            type: 'success',
            timeout: this.defaultTimeout,
            title: `Restore ${capitalize(this.itemType)}`,
            message: `"${this.buildNameForMessage(item)}" restored.`
          });
          this.refreshData();
        })
        .catch(() => {
          this.flashMessages.add({
            type: 'error',
            timeout: this.defaultTimeout,
            title: `Restore ${capitalize(this.itemType)}`,
            message: `Error restoring "${this.buildNameForMessage(
              destroyedItem
            )}".`
          });
        });
    }
  },

  actions: {
    load() {
      this.loadSelectedItems(this.selectedItems);
      this.reset();
      this.modal.close();
    },

    remove(item) {
      this.remove(item);
    },

    pageNumber(number) {
      this.set('params.page.number', number);
    },

    previous() {
      this.set('params.page.number', this.params.page.number - 1);
    },

    next() {
      this.set('params.page.number', this.params.page.number + 1);
    },

    findByText() {
      this.set('isTextSearchDisplayForced', true);
      this.findByText.perform();
    },

    clear() {
      this.set('searchText', '');
      this.setProperties({
        'params.text': '',
        'params.page.number': 1
      });
    },

    cancel() {
      this.modal.close();
    }
  }
});
