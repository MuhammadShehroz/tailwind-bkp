import Controller from '@ember/controller';
import Pagination from 'frontend/mixins/pagination-info';
import { computed } from '@ember/object';
import groupBy from 'frontend/lib/group-by';
import ListBase from 'frontend/mixins/list-base';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { reads, notEmpty, or, alias } from '@ember/object/computed';

export default Controller.extend(ListBase, Pagination, {
  archived: false,
  successTitle: 'Client successfully deleted',

  queryParams: [
    {
      archived: {
        type: 'boolean'
      },

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

  groupedClients: groupBy('model', 'firstLetter'),
  clientsPresent: notEmpty('model'),

  pagination: reads('model.meta.pagination'),
  totalCount: alias('model.meta.total_count'),

  organization: service(),
  modals: service(),
  loader: service(),
  currentOrganization: reads('organization.current'),
  noBlankSlate: notEmpty('currentOrganization.clientCreatedAt'),
  filterPresent: notEmpty('name'),
  showRecords: or('clientsPresent', 'noBlankSlate', 'filterPresent'),

  init() {
    this._super();
    this.resetFilters();
  },

  defaultParams: computed(function () {
    let result = {
      sort: 'name',
      order: 'asc',
      page: 1,
      name: null
    };

    return result;
  }),

  nameFilter: computed('name', {
    get() {
      return this.name;
    },

    set(key, value) {
      this.onClientNameChange.perform(value, 500);
      return value;
    }
  }),

  resetFilters() {
    this.setProperties(this.defaultParams);
    this.onClientNameChange.perform(null, 100);
  },

  onClientNameChange: task(function* (name, delay) {
    yield timeout(delay);
    this.set('name', name);
  }).restartable(),

  actions: {
    sort(sort, order) {
      this.setProperties({
        sort,
        order
      });
    },

    resetFilters() {
      this.resetFilters();
    },

    delete(model) {
      this.set(
        'successMessage',
        `"${model.name}" and all of its Contacts, Invoices, and Estimates deleted.`
      );
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        headerTitle: 'Delete Client',
        title: `Are you sure you want to delete "${model.name}"?`,
        message:
          'All traces of this client, including any contacts, invoices, and estimates will be immediately and permanently deleted. You cannot undo this action.',

        confirmButtonLabel: 'Delete client',
        cancelButtonLabel: 'Keep client',
        isConfirmButtonStyleDanger: true,
        confirm: () => this.delete.perform(model)
      });
    }
  }
});
