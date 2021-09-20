import Controller from '@ember/controller';
import FormBase from 'frontend/mixins/form-base';
import { inject as service } from '@ember/service';
import { empty, reads } from '@ember/object/computed';

export default Controller.extend(FormBase, {
  metrics: service(),
  organization: service(),
  currentOrganization: reads('organization.current'),
  reloadOrganization: empty('organization.current.clientCreatedAt'),

  transitionToSuitedRoute(success) {
    let newTransition = this.transitionToRoute(this.done);
    newTransition.data.showSend = success;
  },

  transitionToNextRoute(success, model = null, route = null) {
    if (this.done) {
      this.transitionToSuitedRoute(success);
      return;
    }

    if (route) {
      this.transitionToRoute(route, model);
    } else {
      this.transitionOnCancel();
    }
  },

  async forceOrganizationReload() {
    let currentOrganization = await this.currentOrganization;

    currentOrganization.reload();
  },

  saveChain() {
    return this.model.save().then(() => {
      let { isNew } = this.model;
      if (this.reloadOrganization) {
        this.forceOrganizationReload();
      }

      if (isNew) this.metrics.trackEvent({ event: 'client_added' });
      this.transitionToNextRoute(true, this.model, 'clients.show');
      this.flashMessages.add({
        type: 'success',
        title: 'Success',
        message: this.successMessage,
        timeout: this.defaultTimeout
      });
    });
  },

  actions: {
    cancel() {
      this.transitionToNextRoute(false);
    },

    async fetchSubregions() {
      this.set(
        'subregions',
        await this.fetchSubregions(this.model.billingAddress.country)
      );
    }
  }
});
