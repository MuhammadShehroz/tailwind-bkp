import Service, { inject as service } from '@ember/service';
import EmberObject, { computed } from '@ember/object';

const TIMEZONES = window.BSN.timezones;

export default Service.extend({
  organization: service(),

  all: computed(function () {
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

  current: computed('organization.current.timezone', 'all', function () {
    return this.all.findBy('key', this.organization.current.get('timezone'));
  })
});
