/* eslint-disable ember/no-controller-access-in-routes */
import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import { inject as service } from '@ember/service';

export default AuthenticatedRoute.extend({
  ajax: service(),
  organization: service(),
  recordsChannel: service(),
  titleToken: 'Payment Methods',

  model() {
    return this.organization.current;
  },

  setErrors(errors) {
    if (errors) {
      let controller = this.controllerFor('account.payment-methods');
      controller.send('connectionError');
      controller.set('error', null);
      controller.set('error_description', null);
    }
  },

  createPaypalMerchantProfile(code) {
    let controller = this.controllerFor('account.payment-methods');
    this.store.findRecord('paypal-merchant-profile', -1).then((record) => {
      record.set('temporaryCode', code);
      record
        .save()
        .then(() => {
          this.refresh();
          controller.set('paypalMerchantProfile', record);
          controller.send('paypalConnected');
        })
        .catch(() => {
          controller.set('paypalMerchantProfile', record);
          controller.send('connectionError', record);
        });
    });
  },

  sleep(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  },

  async reloadModelAfterDelay() {
    await this.sleep(2000);
    let model = await this.model();
    await model.reload();
  },

  createStripeMerchantProfile(code) {
    let record = this.store.createRecord('stripe-merchant-profile', { code });
    let controller = this.controllerFor('account.payment-methods');
    this.reloadModelAfterDelay();
    record
      .save()
      .then(() => this.fetchStripeProfile())
      .then(() => {
        controller.set('stripeMerchantProfile', record);
        controller.send('stripeConnected');
      })
      .catch(() => {
        controller.set('stripeMerchantProfile', record);
        controller.send('connectionError', record);
      });
    controller.set('scope', null);
    controller.set('code', null);
  },

  async fetchStripeProfile() {
    return this.store
      .findRecord('stripeMerchantProfile', -1)
      .then((record) => {
        this.controllerFor('account.payment-methods').set(
          'stripeMerchantProfile',
          record
        );
      })
      .catch(() => {});
  },

  async fetchCoinbaseProfile() {
    return this.store
      .findRecord('coinbaseMerchantProfile', -1)
      .then((record) => {
        this.controllerFor('account.payment-methods').set(
          'coinbaseMerchantProfile',
          record
        );
      })
      .catch(() => {
        this.controllerFor('account.payment-methods').set(
          'coinbaseMerchantProfile',
          this.store.createRecord('coinbaseMerchantProfile')
        );
      });
  },

  fetchPaypalProfile() {
    this.store
      .findRecord('paypalMerchantProfile', -1)
      .then((record) => {
        this.controllerFor('account.payment-methods').set(
          'paypalMerchantProfile',
          record
        );
      })
      .catch(() => {});
  },

  clearParams() {
    let controller = this.controllerFor('account.payment-methods');
    controller.set('scope', null);
    controller.set('code', null);
    controller.set('paypalCode', null);
  },

  actions: {
    refreshModel() {
      this.model.refresh();
    },

    didTransition() {
      let params = this.paramsFor('account.payment-methods');
      if (params.paypalCode) {
        this.createPaypalMerchantProfile(params.paypalCode);
      } else if (params.code) {
        this.createStripeMerchantProfile(params.code);
      }

      this.setErrors(params.error);
      this.clearParams();
      this.fetchPaypalProfile();
      this.fetchStripeProfile();
      this.fetchCoinbaseProfile();
    }
  }
});
/* eslint-enable ember/no-controller-access-in-routes */
