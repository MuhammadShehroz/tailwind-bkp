import Model, { attr, belongsTo } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';

const presence = 'presence';

const STATUS_TITLES = {
  pending: 'Payment pending',
  in_progress: 'Payment pending', // eslint-disable-line camelcase
  success: 'Payment received',
  failure: 'Payment failed'
};

const Validations = buildValidations({
  amount: validator(presence, true),
  date: validator(presence, true)
});

export default Model.extend(Validations, {
  amount: attr('number'),
  date: attr('date'),
  medium: attr(),
  reference: attr(),
  status: attr(),
  failureMessage: attr(),
  invoice: belongsTo(),

  isPending: equal('status', 'pending'),
  isFailure: equal('status', 'failed'),
  title: computed('status', function () {
    return STATUS_TITLES[this.status];
  }),

  statusClass: computed('status', function () {
    switch (this.status) {
      case 'pending':
        return 'text-gray-700 bg-gray-50';
      case 'success':
        return 'text-green-700 bg-green-50';
      case 'failure':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  })
});
