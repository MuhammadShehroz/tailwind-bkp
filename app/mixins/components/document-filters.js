import Mixin from '@ember/object/mixin';
import { alias, readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent, isBlank } from '@ember/utils';
import delegate from 'frontend/lib/delegate';
import { PromiseObject } from '@ember-data/store/-private';
import moment from 'moment';

let dateFormatParam = 'YYYY-MM-DD';
const exceptSelectors = ['.ember-power-select-dropdown', '.pika-single'];

function convertDate(name) {
  name = `_filters.${name}`;

  return computed(name, {
    get() {
      return moment.utc(this.get(name));
    },

    set(key, value) {
      let newValue = moment.utc(value);
      newValue = newValue.isValid() ? newValue.format(dateFormatParam) : null;
      this.set(name, newValue);
      return value;
    }
  });
}

export function convertStatus(name) {
  return computed('status', {
    get() {
      let status = this.status || [];
      return status.includes(name);
    },

    set(key, value) {
      let statuses = this.status || [];

      if (value) {
        statuses.addObject(name);
      } else {
        statuses.removeObject(name);
      }

      this.set('status', statuses.uniq());

      return value;
    }
  });
}

export default Mixin.create(
  delegate(alias, '_filters', ['currency', 'status', 'clientId']),
  {
    classNames: ['documents', 'filters'],

    clients: service(),
    organization: service(),
    currencies: service(),
    documentStatus: service(),

    startDate: convertDate('after'),
    endDate: convertDate('before'),

    statusClosed: convertStatus('closed'),
    statusDraft: convertStatus('draft'),
    statusOpen: convertStatus('open'),

    dateFormat: readOnly('organization.current.jsDateFormat'),

    client: computed('clientId', {
      get() {
        let { clientId } = this;

        if (isPresent(clientId)) {
          return this.clients.fetch(clientId);
        }

        return null;
      },

      set(key, value) {
        this.set('clientId', isPresent(value) ? value.get('id') : null);
        return value;
      }
    }),

    resetFilters() {
      this.set('_filters', this.filters.copy());
    },

    clientFilterSummary: computed('filters.clientId', function () {
      let { clientId } = this.filters;

      if (isPresent(clientId)) {
        return PromiseObject.create({
          promise: this.clients.fetch(clientId)
        });
      } else {
        return { name: 'All Clients' };
      }
    }),

    dateFilterSummary: computed('filters.{after,before}', function () {
      let { after, before } = this.filters;
      let startMoment = moment.utc(after);
      let endMoment = moment.utc(before);
      let { dateFormat } = this;

      if (startMoment.isValid()) {
        if (endMoment.isValid()) {
          return `From ${startMoment.format(dateFormat)} to ${endMoment.format(
            dateFormat
          )}`;
        } else {
          return `After ${startMoment.format(dateFormat)}`;
        }
      } else if (endMoment.isValid()) {
        return `Before ${endMoment.format(dateFormat)}`;
      }

      return 'All Time';
    }),

    statusFilterSummary: computed('filters.status', function () {
      let { status } = this.filters;

      if (isBlank(status)) {
        return 'All Types';
      }

      return status.map((s) => this.documentStatus.statusLabel(s)).join(', ');
    }),

    currencyFilterSummary: computed(
      'filters.currency',
      'currencies.all',
      function () {
        let { currency } = this.filters;

        if (isBlank(currency)) {
          return 'All Currencies';
        }

        return this.currencies.name(currency);
      }
    ),

    init() {
      this._super(...arguments);
      this.resetFilters();
    },

    toggleFilters() {
      this.toggleProperty('visibleFilters');
    },

    actions: {
      apply() {
        this.apply(this._filters);
        this.resetFilters();
        this.toggleFilters();
      },

      reset() {
        this.reset();
        this.resetFilters();
        this.toggleFilters();
      },

      clearFilter(item) {
        let defaultValue = this.get(`defaultParams.${item}`);
        this._filters.set(item, defaultValue);
        this.clearFilter(item, defaultValue);
      },

      showFilters() {
        this.toggleFilters();
      },

      closeFilters(e) {
        if (!this.visibleFilters) return;
        let hasExceptSelector = exceptSelectors.any(
          (selector) => !!e.target.closest(selector)
        );
        if (hasExceptSelector) return;
        this.set('visibleFilters', false);
      }
    }
  }
);
