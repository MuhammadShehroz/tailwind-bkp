import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  titleToken: 'Sign up',
  layout: 'auth',

  model(params) {
    return this.store
      .createRecord('invitation-signup', {})
      .buildNew(params.token)
      .catch(() => {
        this.flashMessages.add({
          type: 'error',
          message: 'Invitation expired'
        });

        this.transitionTo('/');
      });
  }
});
