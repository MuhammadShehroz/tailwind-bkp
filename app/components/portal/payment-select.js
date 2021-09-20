import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly, equal, gt, and } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  organization: service(),
  classNames: ['w-full'],
  currentOrganization: readOnly('organization.current'),
  creditCard: 'Credit Card',
  coinbase: 'Coinbase',
  ach: 'ACH Bank Transfer',
  paypal: 'Paypal',
  plaidLinkToken: null,
  showPayView: gt('selectedPayment.length', 1).readOnly(),

  isOrganizationStripeConnected: readOnly(
    'currentOrganization.isStripeConnected'
  ),

  isOrganizationCoinbaseConnected: readOnly(
    'currentOrganization.isCoinbaseConnected'
  ),

  isOrganizationPaypalConnected: readOnly(
    'currentOrganization.isPaypalConnected'
  ),

  multiPayment: gt('paymentOptions.length', 1).readOnly(),
  singlePayment: equal('paymentOptions.length', 1).readOnly(),
  showPaypal: and(
    'isOrganizationPaypalConnected',
    'model.paypalPaymentEnabled',
    'model.payable'
  ).readOnly(),

  showCardPayment: and(
    'isOrganizationStripeConnected',
    'model.stripePaymentEnabled',
    'model.payable'
  ).readOnly(),

  showAchPayment: and(
    'isOrganizationStripeConnected',
    'model.achPaymentEnabled',
    'model.payable'
  ).readOnly(),

  showCoinbasePayment: and(
    'isOrganizationCoinbaseConnected',
    'model.coinbasePaymentEnabled',
    'model.payable'
  ).readOnly(),

  fetchLinkToken() {
    let adapter = this.store.adapterFor('invoice');
    adapter.plaidLinkToken(this.model).then((result) => {
      result.json().then((json) => {
        this.set('plaidLinkToken', json.plaid_link_token);
      });
    });
  },

  paymentOptions: computed(
    'ach',
    'creditCard',
    'paypal',
    'coinbase',
    'showAchPayment',
    'showCardPayment',
    'showCoinbasePayment',
    'showPaypal',
    function () {
      let options = [];

      if (this.showCardPayment) {
        options.push(this.creditCard);
      }

      if (this.showPaypal) {
        options.push(this.paypal);
      }

      if (this.showCoinbasePayment) {
        options.push(this.coinbase);
      }

      if (this.showAchPayment) {
        options.push(this.ach);
        this.fetchLinkToken();
      }

      return options;
    }
  )
});
