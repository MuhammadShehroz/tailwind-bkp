import Route from '@ember/routing/route';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import PasswordConfirmation from 'frontend/utils/password-confirmation';

export default Route.extend(AuthenticatedRouteMixin, {
  user: service(),
  titleToken: 'Delete User Profile',

  buildRouteInfoMetadata() {
    return {
      label: this.titleToken
    };
  },

  beforeModel() {
    // this needs to override beforeModel from authenticatedRoute;
    // so when a user has no organization, redirecting to accountHub disabled on this route
  },

  model() {
    return this.user.current;
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
      organizations:
        controller.organizations ||
        (await this.store.query('organization', {})),

      confirm
    });
  }
});
