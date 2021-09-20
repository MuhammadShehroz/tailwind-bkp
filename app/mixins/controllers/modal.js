import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  modals: service(),

  close() {
    this.modals.close();
  },

  actions: {
    close() {
      this.close();
    }
  }
});
