import Service from '@ember/service';
import { computed } from '@ember/object';

const FREQUENCY_TYPE_LABELS = {
  week: 'Weekly',
  month: 'Monthly',
  quarter: 'Quarterly',
  year: 'Yearly',
  day: 'Specific number of days'
};

export default Service.extend({
  labels: FREQUENCY_TYPE_LABELS,
  invoicingFrequencies: computed('labels', function () {
    let options = [];
    for (let name in this.labels) {
      options.push({
        name: this.labels[name],
        value: name
      });
    }

    return options;
  }),

  findByType(type) {
    return this.invoicingFrequencies.findBy('value', type);
  }
});
