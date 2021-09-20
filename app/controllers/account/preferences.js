import Controller from '@ember/controller';
import EmberObject, { computed } from '@ember/object';
import moment from 'moment';

const TIMEZONES = window.BSN.timezones;
const DATE_FORMATS = window.BSN.organization.dateFormats;

export default Controller.extend({
  timezones: computed(function () {
    let options = [];

    Object.keys(TIMEZONES).forEach((key) => {
      let { name, offset } = TIMEZONES[key];

      options.push(
        EmberObject.create({
          key,
          label: `(GMT${offset}) ${name}`
        })
      );
    });

    return options;
  }),

  dateFormats: computed(function () {
    let sampleDate = moment().set('month', 2).utc();
    let options = [];

    for (let name in DATE_FORMATS) {
      let dateFormat = DATE_FORMATS[name];

      options.push(
        EmberObject.create({
          key: name,
          label: sampleDate.format(dateFormat.js_format)
        })
      );
    }

    return options;
  }),

  actions: {
    async fetchSubregions() {
      this.set(
        'subregions',
        await this.fetchSubregions(this.model.billingAddress.country)
      );
    },

    cancel() {
      this.transitionToRoute('index');
    },

    addTax() {
      return this.addTax();
    }
  }
});
