import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  organization: service(),

  model() {
    return this.organization.current;
  },

  setupController(controller, model) {
    model.buildBillingAddress();
    this._super(controller, model);
  },

  deactivate() {
    this.modelFor(this.routeName).rollbackAttributes();
  }
});
