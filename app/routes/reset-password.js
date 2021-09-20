import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Change your password',
  layout: 'auth',

  queryParams: {
    reset_token: { refreshModel: true } // eslint-disable-line camelcase
  },

  model(params) {
    this.set('token', params.reset_token);
    return this.store.createRecord('password');
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('token', this.token);
  }
});
