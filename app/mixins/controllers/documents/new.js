import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { pluralize } from 'ember-inflector';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Mixin.create({
  queryParams: computed(function () {
    return ['client'];
  }),

  metrics: service(),
  organization: service(),
  currentOrganization: reads('organization.current'),
  reloadOrganization: null,
  sendMetricsEventAfterCreate: false,

  async forceOrganizationReload() {
    let currentOrganization = await this.currentOrganization;

    currentOrganization.reload();
  },

  actions: {
    cancel() {
      this.transitionToRoute(pluralize(this.model.modelName));
    }
  }
});
