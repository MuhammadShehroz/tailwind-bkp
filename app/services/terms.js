import Service, { inject as service } from '@ember/service';
import EmberObject, { computed } from '@ember/object';
import moment from 'moment';
import { readOnly } from '@ember/object/computed';

const TERMS = window.BSN.document.net_terms;

export default Service.extend({
  organization: service(),
  dateFormat: readOnly('organization.current.jsDateFormat'),
  startDate: null,

  paymentTerms: computed('startDate', 'dateFormat', function () {
    let terms = [];
    let startDate = this.startDate
      ? moment(this.startDate).utc()
      : moment().utc();

    for (let name in TERMS) {
      let term = TERMS[name];
      let date = startDate.startOf('day').clone().add(term.days, 'days');
      let netLabel = term.label;
      let termSelectedLabel = `${date.format(this.dateFormat)} (${netLabel})`;
      let labelPrefix = `${term.days} days`;
      let dropdownLabel = `${labelPrefix} - ${termSelectedLabel}`;

      if (term.days === 0 || term.days === null) {
        dropdownLabel = term.label;
        labelPrefix = term.label;
        netLabel = null;
        termSelectedLabel = `${date.format(this.dateFormat)} (Today)`;

        if (term.days == null) {
          termSelectedLabel = term.label;
        }
      }

      terms.push(
        EmberObject.create({
          value: name,
          dropdownLabel,
          labelPrefix,
          netLabel,
          termSelectedLabel,
          date: date.toDate()
        })
      );
    }

    return terms;
  }),

  recurringPaymentTerms: computed(function () {
    let terms = [];
    for (let name in TERMS) {
      let term = TERMS[name];
      let netLabel = term.label;

      terms.push(
        EmberObject.create({
          value: name,
          dropdownLabel: netLabel,
          termSelectedLabel: netLabel
        })
      );
    }

    return terms;
  }),

  findTermByType(option, preferences = false) {
    let terms = this.paymentTerms;
    if (preferences) {
      terms = this.paymentTermsForPreferences;
    }

    return terms.find(function (term) {
      return term.value === option;
    });
  },

  findRecurringTermByType(option) {
    return this.recurringPaymentTerms.findBy('value', option);
  },

  paymentTermsForPreferences: computed(function () {
    let terms = [];
    for (let name in TERMS) {
      let term = TERMS[name];
      let { days, label: termLabel } = term || {};
      let label = `${days} days from invoice date (${termLabel})`;
      if (days === 0) {
        label = termLabel;
      }

      if (days != null) {
        terms.push(
          EmberObject.create({
            value: name,
            label
          })
        );
      }
    }

    return terms;
  }),

  otherTermWithCustomLabelDisplay(date) {
    let otherTerm = this.findTermByType('other');
    otherTerm.set('termSelectedLabel', moment(date).format(this.dateFormat));

    return otherTerm;
  },

  calculateDueOn(netTerms, dueOn, issuedOn) {
    let date = moment().utc().startOf('day');

    this.set('startDate', date);

    if (netTerms === TERMS.other.label.toLowerCase()) {
      let daysBetweenDueOnAndIssuedOn = moment(dueOn).diff(
        moment(issuedOn),
        'days'
      );
      let otherTermsDueOn = date.add(daysBetweenDueOnAndIssuedOn, 'days');

      return otherTermsDueOn.toDate();
    }

    return this.findTermByType(netTerms).date;
  },

  isOtherTerm(term) {
    return term === 'other';
  }
});
