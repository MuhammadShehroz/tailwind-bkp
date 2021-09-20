import Controller from '@ember/controller';
import PaginationInfo from 'frontend/mixins/pagination-info';
import ExportReportMixin from 'frontend/mixins/export-report';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { reads, notEmpty, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import DateRange from 'frontend/utils/filter/date-range';
import DocumentFilter from 'frontend/utils/filter/document-filter';
import { EstimateStatusList } from 'frontend/utils/filter/status-list';

const clients = [];
const dateRangeObject = {};

export default Controller.extend(PaginationInfo, ExportReportMixin, {
  exportType: 'EstimatesExport',
  estimates: reads('model'),
  estimatesPresent: notEmpty('estimates'),

  pagination: reads('model.meta.pagination'),
  summaryPerQuery: reads('model.meta.summary'),

  organization: service(),
  modals: service(),
  currentOrganization: reads('organization.current'),
  noBlankSlate: notEmpty('currentOrganization.estimateCreatedAt'),
  showRecords: or('estimatesPresent', 'noBlankSlate'),
  clients,
  status: A(),
  statuses: A(),

  clientId: null,
  dateRangeObject,
  dateRanges: A(),
  before: null,
  after: null,

  queryParams: [
    {
      name: {
        type: 'string'
      },

      clientId: {
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
    this.setProperties(this.defaultParams);
    this.set('filter', new DocumentFilter(EstimateStatusList));
    this.set('rangeManager', new DateRange());
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

  summary: computed('model.meta.summary', function () {
    return {
      total: this.model.meta?.summary[0]?.total,
      currency: this.model.meta?.summary[0]?.currency
    };
  }),

  selectedStatus: computed('filter', 'status', function () {
    return this.filter.selectedStatus(this.status);
  }),

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
    },

    setStatus(option) {
      this.status.clear();
      this.status.pushObject(option.value);
    },

    setRange(option) {
      this.set('dateRange', option);
      this.set('before', this.rangeManager.before(option.value));
      this.set('after', this.rangeManager.after(option.value));
    }
  }
});
