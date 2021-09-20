import Component from '@ember/component';
import DocumentFiltersComponent, {
  convertStatus
} from 'frontend/mixins/components/document-filters';
import { computed } from '@ember/object';
import isEqual from 'lodash.isequal';

export default Component.extend(DocumentFiltersComponent, {
  classNameBindings: ['visibleFilters:expanded'],

  filterApplied: computed('filters', 'defaultParams', function () {
    let { filters } = this;
    let { defaultParams } = this;
    let filterParams = ['clientId', 'before', 'after', 'status', 'currency'];

    return filterParams.reduce((result, item) => {
      let filterItem = item;
      let isApplied =
        filters[item] && !isEqual(filters[item], defaultParams[item]);
      if (item === 'before' || item === 'after') {
        filterItem = 'beforeOrAfter';
        isApplied =
          !isEqual(filters.before, defaultParams.before) ||
          !isEqual(filters.after, defaultParams.after);
      }

      result[filterItem] = isApplied;
      return result;
    }, {});
  }),

  appliedFilterLength: computed('filterApplied', function () {
    let filters = this.filterApplied;
    return Object.values(filters).filter((value) => value).length;
  }),

  statusPastDue: convertStatus('past_due'),
  statusApproved: convertStatus('approved'),
  statusDeclined: convertStatus('declined'),
  statusConverted: convertStatus('converted'),

  init() {
    this._super(...arguments);
    this.documentStatusValues = {
      invoice: [
        { valuePath: 'statusDraft', label: 'Draft' },
        { valuePath: 'statusClosed', label: 'Closed' },
        { valuePath: 'statusOpen', label: 'Open' },
        { valuePath: 'statusPastDue', label: 'Past Due' }
      ],

      estimate: [
        { valuePath: 'statusDraft', label: 'Draft' },
        { valuePath: 'statusOpen', label: 'Open' },
        { valuePath: 'statusApproved', label: 'Approved' },
        { valuePath: 'statusDeclined', label: 'Declined' },
        { valuePath: 'statusConverted', label: 'Converted' }
      ]
    };
  },

  actions: {
    focusIn() {}
  }
});
