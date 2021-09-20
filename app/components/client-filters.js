import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  clientName: computed('nameOfClient', {
    get() {
      return this.nameOfClient;
    },

    set(key, value) {
      this.set('nameOfClient', value);
      return value;
    }
  }),

  actions: {
    reset() {
      this.reset();
    }
  }
});
