import ENV from 'frontend/config/environment';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';

const { clientId } = ENV.stripe;

export default Controller.extend({
  queryParams: ['error', 'error_description', 'scope', 'code', 'paypalCode'],
  modals: service(),
  organization: service(),
  metrics: service(),
  storage: service(),
  showCoinbaseCredentials: false,
  showCoinbaseConnectButton: computed(
    'showCoinbaseCredentials',
    'isCoinbaseConnected',
    function () {
      return !this.showCoinbaseCredentials && !this.isCoinbaseConnected;
    }
  ),

  code: null,

  error_description: null, // eslint-disable-line camelcase

  isStripeConnected: readOnly('model.isStripeConnected'),
  isPaypalConnected: readOnly('model.isPaypalConnected'),
  isCoinbaseConnected: readOnly('model.isCoinbaseConnected'),

  stripeEmail: readOnly('stripeMerchantProfile.stripeEmail'),

  includePaypal: computed('model.includePaypal', {
    get() {
      return this.model.includePaypal;
    },

    set(key, value) {
      this.model.set('includePaypal', value);
      this.model.save().then(() => {
        this.flashMessages.add({
          type: 'success',
          title: 'Success',
          message: `Payment option was updated.`,
          timeout: this.defaultTimeout
        });
      });
      return value;
    }
  }),

  includeAch: computed('currentOrganization.includeAch', 'model.includeAch', {
    get() {
      return this.model.includeAch;
    },

    set(key, value) {
      this.model.set('includeAch', value);
      this.model.save().then(() => {
        this.flashMessages.add({
          type: 'success',
          title: 'Success',
          message: `Payment option was updated.`,
          timeout: this.defaultTimeout
        });
      });
      return value;
    }
  }),

  includeCoinbase: computed('model.includeCoinbase', {
    get() {
      return this.model.includeCoinbase;
    },

    set(key, value) {
      this.model.set('includeCoinbase', value);
      this.model.save().then(() => {
        this.flashMessages.add({
          type: 'success',
          title: 'Success',
          message: `Payment option was updated.`,
          timeout: this.defaultTimeout
        });
      });
      return value;
    }
  }),

  includeStripe: computed('model.includeStripe', {
    get() {
      return this.model.includeStripe;
    },

    set(key, value) {
      this.model.set('includeStripe', value);
      this.model.save().then(() => {
        this.flashMessages.add({
          type: 'success',
          title: 'Success',
          message: `Payment option was updated.`,
          timeout: this.defaultTimeout
        });
      });
      return value;
    }
  }),

  destroyPaypalMerchantProfile() {
    this.paypalMerchantProfile
      .destroyRecord()
      .then(() => {
        this.model.reload().then(() => {
          this.flashMessages.add({
            type: 'success',
            title: 'Success',
            message: `Your Paypal account has been disconnected.`,
            timeout: this.defaultTimeout
          });
        });
      })
      .catch(() => {
        this.flashMessages.add({
          type: 'error',
          title:
            'There was an error while disconnecting your account. Please contact support',

          message: this.paypalMerchantProfile.errors.messages.join(', '),
          timeout: this.defaultTimeout
        });
      });
  },

  destroyStripeMerchantProfile() {
    this.stripeMerchantProfile
      .destroyRecord()
      .then(() => {
        this.model.reload().then(() => {
          this.flashMessages.add({
            type: 'success',
            title: 'Success',
            message: 'Your Stripe account has been disconnected.',
            timeout: this.defaultTimeout
          });
        });
      })
      .catch(() => {
        this.flashMessages.add({
          type: 'error',
          title:
            'There was an error while disconnecting your account. Please contact support',

          message: this.stripeMerchantProfile.errors.messages.join(', '),
          timeout: this.defaultTimeout
        });
      });
  },

  destroyCoinbaseMerchantProfile() {
    this.coinbaseMerchantProfile
      .destroyRecord()
      .then(() => {
        this.model.reload().then(() => {
          this.flashMessages.add({
            type: 'success',
            title: 'Success',
            message: `Your Coinbase account has been disconnected.`,
            timeout: this.defaultTimeout
          });
        });

        this.set(
          'coinbaseMerchantProfile',
          this.store.createRecord('coinbaseMerchantProfile')
        );
      })
      .catch(() => {
        this.flashMessages.add({
          type: 'error',
          title:
            'There was an error while disconnecting your account. Please contact support',

          message: this.paypalMerchantProfile.errors.messages.join(', '),
          timeout: this.defaultTimeout
        });
      });
  },

  redirectToURLIfNeeded() {
    let redirectURL = this.storage.getSessionItem('redirectURL');
    if (redirectURL) {
      this.transitionToRoute(redirectURL);
      this.storage.removeSessionItem('redirectURL');
    }
  },

  actions: {
    editCoinbase() {
      this.set('showCoinbaseCredentials', true);
    },

    endCoinbaseEditing() {
      this.set('showCoinbaseCredentials', false);
    },

    connectStripe() {
      /* eslint-disable camelcase */
      let query = Object.entries({
        response_type: 'code',
        client_id: clientId,
        scope: 'read_write',
        redirect_uri: window.location.href
      })
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      /* eslint-enable camelcase */

      window.location = `https://connect.stripe.com/oauth/authorize?${query}`;
    },

    async reload() {
      setTimeout(() => {
        this.model.reload();
      }, 1000);
    },

    connectPaypal() {
      let record = this.store.createRecord('paypal-merchant-profile', {
        organizationId: this.organization.id
      });
      record.save().then((response) => {
        window.location = response.loginUrl;
      });
    },

    connectionError(profile) {
      this.flashMessages.add({
        type: 'error',
        title:
          'There was an error while connecting your account. Please try again.',

        message: profile.errors.messages.join(', ')
      });
    },

    stripeConnected() {
      this.metrics.trackEvent({
        event: 'stripe_connected'
      });
      this.flashMessages.add({
        type: 'success',
        title: 'Your Stripe account has been connected',
        message: `Your Send Invoice panel will now display this payment option.
        'If enabled, when you send an invoice, your client will see a link to pay the invoice online.`,
        timeout: this.defaultTimeout
      });
      this.redirectToURLIfNeeded();
    },

    paypalConnected() {
      this.metrics.trackEvent({
        event: 'paypal_connected'
      });
      this.flashMessages.add({
        type: 'success',
        title: 'Your Paypal account has been connected',
        message: `Your Send Invoice panel will now display this payment option.
        'If enabled, when you send an invoice, your client will see a link to pay the invoice online.`,
        timeout: this.defaultTimeout
      });
      this.redirectToURLIfNeeded();
    },

    disconnectStripe() {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        headerTitle: 'Disconnect account',
        title: 'Are you sure?',
        confirmButtonLabel: 'Disconnect',
        cancelButtonLabel: 'Cancel',
        confirm: () => this.destroyStripeMerchantProfile()
      });
    },

    disconnectCoinbase() {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        headerTitle: 'Disconnect account',
        title: 'Are you sure?',
        confirmButtonLabel: 'Disconnect',
        cancelButtonLabel: 'Cancel',
        confirm: () => this.destroyCoinbaseMerchantProfile()
      });
    },

    disconnectPaypal() {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        headerTitle: 'Disconnect account',
        title: 'Are you sure?',
        confirmButtonLabel: 'Disconnect',
        cancelButtonLabel: 'Cancel',
        confirm: () => this.destroyPaypalMerchantProfile()
      });
    }
  }
});
