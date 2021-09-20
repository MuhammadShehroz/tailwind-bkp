import Controller from '@ember/controller';
import PaginationInfo from 'frontend/mixins/pagination-info';
import ExportReportMixin from 'frontend/mixins/export-report';
import { computed } from '@ember/object';
import { reads, notEmpty, or, readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { A } from '@ember/array';
import DateRange from 'frontend/utils/filter/date-range';
import DocumentFilter from 'frontend/utils/filter/document-filter';
import { InvoiceStatusList } from 'frontend/utils/filter/status-list';
import delegate from 'frontend/lib/delegate';

const delegations = delegate(readOnly, 'organization', [
  'decimals',
  'decimalsSeparator',
  'thousandsSeparator'
]);

const clients = [];

const dateRangeObject = {};

const searchFields = [
  {
    key: 'number',
    label: 'Invoice ID'
  },
  {
    key: 'name',
    label: 'Client Name'
  },
  {
    key: 'prefix',
    label: 'Prefix'
  }
];

export default Controller.extend(
  delegations,
  PaginationInfo,
  ExportReportMixin,
  {
    exportType: 'InvoicesExport',
    invoices: reads('model'),
    invoicesPresent: notEmpty('invoices'),
    currencies: service(),

    pagination: reads('model.meta.pagination'),
    graph: reads('model.meta.graph'),

    organization: service(),
    modals: service(),
    currentOrganization: reads('organization.current'),
    noBlankSlate: notEmpty('currentOrganization.invoiceCreatedAt'),
    showRecords: or('invoicesPresent', 'noBlankSlate'),

    displayChart: true,

    clients,
    status: A(),
    statuses: A(),

    // eslint-disable-next-line camelcase
    client_id: null,
    dateRangeObject,
    dateRanges: A(),
    before: null,
    after: null,

    searchField: 'number',

    searchFields,

    searchLabel: computed('searchField', 'searchFields', function () {
      let item = this.searchFields.find(
        (item) => item.key === this.searchField
      );
      return `Search by ${item.label}`;
    }),

    queryParams: [
      {
        name: {
          type: 'string'
        },

        number: {
          type: 'number'
        },

        prefix: {
          type: 'string'
        },

        // eslint-disable-next-line camelcase
        client_id: {
          type: 'number'
        },

        status: {
          type: 'array'
        },

        before: {
          type: 'string'
        },

        after: {
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
        sort: 'number',
        order: 'asc',
        page: 1
      };

      return result;
    }),

    init() {
      this._super(...arguments);
      this.set('filter', new DocumentFilter(InvoiceStatusList));
      this.set('rangeManager', new DateRange());
      this.set('defaultParams.after', this.rangeManager.after('year'));
      this.set('defaultParams.before', this.rangeManager.before('year'));
      this.setProperties(this.defaultParams);
    },

    dateRange: computed('after', 'before', 'filter.dateRange', 'rangeManager', {
      get() {
        return (
          this.filter.dateRange ||
          this.rangeManager.range(this.after, this.before)
        );
      },

      set(key, value) {
        this.set('before', this.rangeManager.before(value));
        this.set('after', this.rangeManager.after(value));
        return value;
      }
    }),

    summary: computed('currencies', 'model.meta.summary', function () {
      return this.model.meta.summary.map((t) => ({
        total: t.total,
        totalDue: t.total_due,
        totalPaid: t.total_paid,
        currency: t.currency
      }));
    }),

    selectedStatus: computed('filter', 'status', function () {
      return this.filter.selectedStatus(this.status);
    }),

    query: computed('searchField', 'searchValue', {
      get() {
        return this.searchValue;
      },

      set(key, value) {
        this.onQueryChange.perform(this.searchField, value, 500);
        return value;
      }
    }),

    onQueryChange: task(function* (searchField, searchValue, delay) {
      yield timeout(delay);
      this.set(searchField, searchValue);
    }).restartable(),

    actions: {
      sort(sort, order) {
        this.setProperties({
          sort,
          order
        });
      },

      clearSearchParams() {
        this.set('searchValue', '');
        this.setProperties({
          number: null,
          name: null,
          prefix: null,
          query: null
        });
      },

      onSelect(key, value, option) {
        this.set(value, option);
      },

      setStatus(option) {
        this.status.clear();
        this.status.pushObject(option.value);
      },

      onSearchKeySelect() {
        this.setProperties({
          number: null,
          name: null,
          prefix: null,
          query: null
        });
      },

      setRange(option) {
        this.set('dateRange', option);
        this.set('before', this.rangeManager.before(option.value));
        this.set('after', this.rangeManager.after(option.value));
      }
    }
  }
);
