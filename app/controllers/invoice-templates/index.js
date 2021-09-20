import Controller from '@ember/controller';
import PaginationInfo from 'frontend/mixins/pagination-info';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { reads, notEmpty, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend(PaginationInfo, {
  exportType: 'InvoiceTemplatesExport',
  invoiceTemplates: reads('model'),
  invoicesPresent: notEmpty('invoiceTemplates'),

  organization: service(),
  modals: service(),

  pagination: reads('model.meta.pagination'),
  currentOrganization: reads('organization.current'),
  noBlankSlate: notEmpty('currentOrganization.invoiceTemplateCreatedAt'),
  showRecords: or('invoicesPresent', 'noBlankSlate'),

  queryParams: [
    {
      name: {
        type: 'string'
      },

      sort: {
        type: 'string'
      },

      order: {
        type: 'string'
      },

      page: {
        type: 'number'
      }
    }
  ],

  defaultParams: computed(function () {
    let result = {
      order: 'asc',
      sort: 'frequency',
      page: 1
    };

    return result;
  }),

  init() {
    this._super(...arguments);
    this.setProperties(this.defaultParams);
  },

  query: computed('name', {
    get() {
      return this.name;
    },

    set(key, value) {
      this.onQueryChange.perform(value, 500);
      return value;
    }
  }),

  onQueryChange: task(function* (name, delay) {
    yield timeout(delay);
    this.set('name', name);
  }).restartable(),

  actions: {
    sort(sort, order) {
      this.setProperties({
        sort,
        order
      });
    }
  }
});
