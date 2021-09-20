import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
import ENV from 'frontend/config/environment';
const stripe = new Stripe(ENV.stripe.publishableKey); /* global Stripe */

export default Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Sign up',
  layout: 'auth',

  model() {
    return this.store.createRecord('signup');
  },

  setupController(controller, model) {
    this._super(controller, model);

    controller.setProperties({
      cardElements: stripe.elements(),
      stripe
    });
  }
});
