import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import PasswordConfirmation from 'frontend/utils/password-confirmation';

export default AuthenticatedRoute.extend({
  organization: service(),
  titleToken: 'Delete Profile',

  model() {
    return this.organization.current;
  },

  afterModel(model) {
    this.set('organizationId', model.id);
  },

  deactivate() {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    this.controller.model.rollbackAttributes();
  },

  async setupController(controller, model) {
    this._super(controller, model);
    let confirm = PasswordConfirmation.create(getOwner(this).ownerInjection());
    confirm.set('relatedModel', model);
    controller.setProperties({
      documentCount: await this.store.queryRecord('document-count-stats', {
        organizationId: this.organizationId
      }),

      confirm
    });
  }
});
