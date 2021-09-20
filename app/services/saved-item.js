import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  store: service(),

  query(params) {
    return this.store.query('saved-item', params);
  },

  allItems: computed(function () {
    return this.store.findAll('saved-item');
  })
});
