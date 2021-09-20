import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Controller.extend({
  organizationMembership: service(),
  memberSinceDate: readOnly('organizationMembership.current.createdAt'),

  actions: {
    async fetchSubregions() {
      this.set(
        'subregions',
        await this.fetchSubregions(this.model.billingAddress.country)
      );
    },

    cancel() {
      this.transitionToRoute('index');
    }
  }
});
