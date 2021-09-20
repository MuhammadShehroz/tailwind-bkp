import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  store: service(),

  query(options = {}) {
    return this.store.query('client', options);
  },

  all: computed(function () {
    return this.store.findAll('client');
  }),

  fetch(id) {
    return this.store.findRecord('client', id, { backgroundReload: false });
  },

  contacts(clientId) {
    return this.store.query('contact', { client_id: clientId }); // eslint-disable-line camelcase
  },

  stats(clientId) {
    return this.store.query('amount-stat', { clientId });
  }
});
