/* eslint-disable ember/no-controller-access-in-routes */
import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  beforeModel() {
    let { code } = this.paramsFor('paypal-payment');
    let controller = this.controllerFor('paypal-payment');
    controller.set('code', null);
    if (code) {
      this.replaceWith('account.payment-methods', {
        queryParams: { paypalCode: code, code: null }
      });
    }
  }
});
/* eslint-enable ember/no-controller-access-in-routes */
