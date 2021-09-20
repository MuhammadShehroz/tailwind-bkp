/* eslint-disable ember/no-controller-access-in-routes */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),

  beforeModel() {
    let { token } = this.paramsFor('confirm-email');

    this.store
      .adapterFor('user')
      .confirm(token)
      .then(() => {
        this.controllerFor('confirm-email').flashMessages.success(
          'Your email has been verified. Please sign in'
        );
        this.transitionTo('login');
      })
      .catch(() => {
        this.controllerFor('confirm-email').flashMessages.warning(
          'Your email could not be verified. Please try again'
        );
        this.transitionTo('login');
      });
  }
});
/* eslint-enable ember/no-controller-access-in-routes */
