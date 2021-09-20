import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  user: service(),

  beforeModel() {
    // this needs to override beforeModel from authenticatedRoute;
    // so when a user has no organization, redirecting to accountHub disabled on this route
  },

  model() {
    return this.user.current;
  },

  deactivate() {
    this.modelFor(this.routeName).rollbackAttributes();
  },

  createAvatar() {
    return this.store.createRecord('avatar');
  },

  removeAvatar() {
    let adapter = this.store.adapterFor('user');
    return adapter.destroyAvatar();
  },

  setupController(controller, model) {
    controller.setProperties({
      avatar: this.createAvatar(),
      removeAvatar: () => this.removeAvatar()
    });
    this._super(controller, model);
  }
});
