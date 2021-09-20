import { alias, reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import Filters, { filterParams } from 'frontend/models/filters';
import Mixin from '@ember/object/mixin';
import PaginationInfo, {
  paginationParams
} from 'frontend/mixins/pagination-info';
import ExportReportMixin from 'frontend/mixins/export-report';
import moment from 'moment';

const dateFormatParam = 'YYYY-MM-DD';

export default Mixin.create(PaginationInfo, ExportReportMixin, {
  queryParams: filterParams.concat(paginationParams),

  clientId: alias('client_id'),
  pagination: reads('model.meta.pagination'),
  summaryPerQuery: reads('model.meta.summary'),

  defaultParams: computed(function () {
    let now = moment.utc();
    let result = {
      order: 'desc',
      page: 1,
      sort: 'issued_on',

      after: now.startOf('year').format(dateFormatParam),
      before: now.endOf('year').format(dateFormatParam),
      // eslint-disable-next-line camelcase
      client_id: null,
      currency: null,
      status: ['draft', 'open']
    };

    return result;
  }),

  filters: computed(...filterParams, function () {
    return Filters.create({ source: this });
  }).readOnly(),

  init() {
    this._super();
    this.resetFilters();
  },

  resetFilters() {
    this.setProperties(this.defaultParams);
  },

  actions: {
    applyFilters(filters) {
      this.setProperties(filters.expand());
    },

    clearFilter(item, defaultValue) {
      this.set(item, defaultValue);
    },

    resetFilters() {
      this.resetFilters();
    },

    sort(sort, order) {
      this.setProperties({
        sort,
        order
      });
    }
  }
});
