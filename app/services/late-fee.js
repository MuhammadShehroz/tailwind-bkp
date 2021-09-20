import Service from '@ember/service';
import EmberObject, { computed } from '@ember/object';
import FeeOption from 'frontend/utils/fee-option';

const lateOptions = {
  percent: [1, 1.5, 5],
  other: [
    {
      label: 'Other percentage...',
      lateFeeKind: 'percent',
      otherPercentage: true
    },
    {
      label: 'Other flat fee',
      lateFeeKind: 'fixed',
      otherPercentage: false
    }
  ]
};

const intervalOptions = [
  { label: 'Per month', lateFeeInterval: 'monthly' },
  { label: 'Per week', lateFeeInterval: 'weekly' },
  { label: 'Per day', lateFeeInterval: 'daily' },
  { label: 'One time', lateFeeInterval: 'one_time' }
];

export default Service.extend({
  lateFeeOptions: computed(function () {
    let options = [
      FeeOption.create({
        label: 'No late fee',
        hasLateFee: false
      })
    ];

    let otherValues = {
      lateFeeInterval: 'monthly',
      lateFee: null,
      hasLateFee: true
    };

    Object.keys(lateOptions).forEach((option) => {
      lateOptions[option].forEach((value) => {
        let attrs;

        if (option === 'percent') {
          attrs = {
            label: `${value}% per month`,
            lateFeeKind: option,
            lateFeeInterval: 'monthly',
            lateFee: value,
            hasLateFee: true
          };
        } else {
          attrs = Object.assign({}, otherValues, value);
        }

        options.push(FeeOption.create(attrs));
      });
    });
    options.forEach((option, index) => option.set('idx', index));
    return options;
  }),

  lateFeeIntervals: computed(function () {
    return intervalOptions.map((interval) => EmberObject.create(interval));
  }),

  lateFeeFind(model) {
    return this.lateFeeOptions.find(function (option) {
      return (
        option.lateFee === model.lateFee &&
        option.lateFeeKind === model.lateFeeKind &&
        option.lateFeeInterval === model.lateFeeInterval
      );
    });
  },

  intervalFind(model) {
    return this.lateFeeIntervals.find(function (option) {
      return option.lateFeeInterval === model.lateFeeInterval;
    });
  }
});
