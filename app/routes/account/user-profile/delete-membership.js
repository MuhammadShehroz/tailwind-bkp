import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import PasswordConfirmation from 'frontend/utils/password-confirmation';

export default AuthenticatedRoute.extend({
  user: service(),
  organization: service(),
  organizationMembership: service(),
  titleToken: 'Delete Membership',

  beforeModel() {
    // this needs to override beforeModel from authenticatedRoute;
    // so when a user has no organization, redirecting to accountHub disabled on this route
  },

  model() {
    return this.organizationMembership.current;
  },

  deactivate() {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    this.controller.model.rollbackAttributes();
  },

  setupController(controller, model) {
    this._super(controller, model);
    let confirm = PasswordConfirmation.create(getOwner(this).ownerInjection());
    confirm.set('relatedModel', model);
    controller.setProperties({
      user: this.user.current,
      organizationName: this.organization.current.get('name'),
      confirm
    });
  }
});
