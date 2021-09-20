import Component from '@ember/component';
import DocumentShowComponent from 'frontend/mixins/components/document-show';
import { inject as service } from '@ember/service';
import { computed, set } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ENV from 'frontend/config/environment';

let subscription;

export default Component.extend(DocumentShowComponent, {
  tagName: 'form',
  currentOrder: null,
  isPaypalReady: false,
  stepPaymentMethod: true,
  disabledConfirm: false,
  paypalLoaded: false,
  coinbaseHostedUrl: null,

  showAchForm: computed.equal('selectedPayment', 'ACH Bank Transfer'),
  showCardForm: computed.equal('selectedPayment', 'Credit Card'),
  showCoinbaseForm: computed.equal('selectedPayment', 'Coinbase'),
  showPayPalForm: computed('selectedPayment', function () {
    if (this.selectedPayment === 'Paypal') {
      let self = this;
      setTimeout(() => {
        self.loadPaypal.call(self);
      }, 2000);
      return true;
    } else {
      return false;
    }
  }),

  payable: readOnly('invoice.payable'),
  stripePaymentEnabled: readOnly('invoice.stripePaymentEnabled'),
  paypalPaymentEnabled: readOnly('invoice.paypalPaymentEnabled'),
  achPaymentEnabled: readOnly('invoice.achPaymentEnabled'),
  coinbasePaymentEnabled: readOnly('invoice.coinbasePaymentEnabled'),

  recordsChannel: service(),
  organization: service(),
  store: service(),
  currencies: service(),
  currencySymbol: computed(
    'currencies.all',
    'currency',
    'invoice.currency',
    function () {
      return this.currencies.symbol(this.invoice.currency);
    }
  ).readOnly(),

  init() {
    this._super(...arguments);
    this.store
      .findRecord('stripeMerchantProfile', 0)
      .then((record) => {
        this.stripeUserId = record.stripeUserId;
        set(
          this,
          'stripe',
          new Stripe(ENV.stripe.publishableKey, {
            stripeAccount: record.stripeUserId
          })
        );
        if (this.isPortal && this.showCardPayment && !this.stepCardData) {
          // this.send('showCardDataForm');
        }

        if (
          this.isPortal &&
          !this.showCardPayment &&
          this.showAchPayment &&
          !this.stepCardData
        ) {
          // this.send('showAchDataForm');
        }
      })
      .catch(() => {}); /* global Stripe */
  },

  handlePaymentError(record) {
    this.processingFinished();
    this.set('paymentError', record.errors.messages.join(', '));
    this.set('disabledConfirm', false);
    record.destroyRecord();
  },

  startRecordListener(charge) {
    let channel = this.recordsChannel;
    subscription = channel.anonymouslySubscribe(
      'Charges',
      charge.get('id'),
      {},
      (result) => {
        this.invoice.store.query('payment', {
          invoice_id: this.invoice.id // eslint-disable-line camelcase
        });
        this.invoice.reload();
        this.reloadEvents();
        if (result === 'success' || result === 'failure') {
          channel.anonymouslyUnsubscribe(subscription);
        }
      }
    );
  },

  async createCoinbaseCharge(amount) {
    let self = this;
    let charge = this.invoice.store.createRecord('coinbase-charge', {
      amount,
      // eslint-disable-next-line camelcase
      invoice_id: this.invoice.id
    });
    await charge.save().catch(() => {
      self.handlePaymentError(charge);
    });
    return charge;
  },

  async createOrder() {
    let self = this;
    let charge = this.invoice.store.createRecord('paypal-charge', {
      amount: this.amount,
      // eslint-disable-next-line camelcase
      invoice_id: this.invoice.id
    });
    await charge.save().catch(() => {
      self.handlePaymentError(charge);
    });
    return charge;
  },

  loadPaypal() {
    let self = this;
    if (!self.paypalLoaded) {
      this.set('paypalLoaded', true);
      window.paypal
        // eslint-disable-next-line new-cap
        .Buttons({
          async createOrder() {
            let order = await self.createOrder();
            if (order) {
              self.set('currentOrder', order);
              return order.ppOrderId;
            }

            return null;
          },

          onApprove(data) {
            self.startProcessing('Processing, please wait');
            self.currentOrder.setProperties({ payerId: data.payerID });
            self.currentOrder
              .save()
              .then(() => {
                self.handlePaymentSuccess();
              })
              .catch(() => {
                self.handlePaymentError(self.currentOrder);
              });
          }
        })
        .render('.paypal');
    }
  },

  handlePaymentSuccess() {
    this.invoice.reload();
    this.processingFinished();
    this.set('paymentError', null);
    this.flashMessages.success(
      'Payment received. Once we process it, a record will appear below.'
    );
    this.accept();
    this.invoice.store.query('payment', {
      invoice_id: this.invoice.id // eslint-disable-line camelcase
    });

    this.set('disabledConfirm', false);
  },

  cardElements: computed('stripe', function () {
    if (this.stripe === undefined) {
      return false;
    }

    return this.stripe.elements();
  }),

  handlePlaidBankAccount: async (publicToken, meta, context) => {
    context.startProcessing('Processing, please wait');
    let adapter = context.store.adapterFor('invoice');
    let publicTokenResult;
    try {
      publicTokenResult = await adapter.plaidPublicToken(
        context.invoice,
        publicToken,
        meta.account_id
      );
    } catch (error) {
      context.processingFinished();
      publicTokenResult = false;
      context.set(
        'paymentError',
        "We're having difficulties processing your request. Please try again later"
      );
    }

    if (publicTokenResult) {
      let record = context.invoice.store.createRecord('ach-charge', {
        invoice_id: context.invoice.id, // eslint-disable-line camelcase
        amount: context.amount,
        kind: 2
      });

      context.startRecordListener(record);

      let self = context;
      try {
        record = await record.save();
      } catch (error) {
        record = false;
        self.handlePaymentError(record);
      }

      if (record) {
        record.set('result', record);
        self.handlePaymentSuccess();
        record.sync();
      }
    }
  },

  amount: computed.reads('invoice.cachedTotalDueUnsettled'),

  actions: {
    cancel() {
      this.set('selectedPayment', null);
    },

    selectPayment(method) {
      this.set('selectedPayment', method);
    },

    processPlaidToken(publicToken, meta) {
      this.handlePlaidBankAccount(publicToken, meta, this);
    },

    showPayPalForm() {
      this.setProperties({
        stepPaymentMethod: false,
        paymentSuccess: false,
        showPayPalForm: true
      });

      let self = this;
      setTimeout(() => {
        self.loadPaypal.call(self);
      }, 2000);
    },

    async createCoinbaseCharge() {
      let charge = null;
      try {
        charge = await this.createCoinbaseCharge(this.amount);
      } catch (e) {
        this.handlePaymentError(
          'Unable to create charge, please try another method or contact the invoice sender'
        );
      }

      if (charge) {
        this.set('coinbaseHostedUrl', charge.hosted_url);
      }
    },

    clearCoinbaseCharge() {
      this.set('coinbaseHostedUrl', null);
    },

    async payWithCrypto() {
      if (this.coinbaseHostedUrl) {
        window.location = this.coinbaseHostedUrl;
      }
    },

    payByCard(stripeElement) {
      this.set('disabledConfirm', true);
      let record = this.invoice.store.createRecord('charge', {
        invoice_id: this.invoice.id, // eslint-disable-line camelcase
        amount: this.amount
      });
      let self = this;
      record
        .save()
        .then((record) => {
          this.startRecordListener(record);
          this.stripe
            .handleCardPayment(record.intent_secret, stripeElement)
            .then(function (result) {
              if (result.paymentIntent) {
                record.set('result', result);
                self.handlePaymentSuccess();
                record.sync();
              } else {
                self.set('disabledConfirm', false);

                let lastPaymentError =
                  result.error.payment_intent.last_payment_error;
                if (lastPaymentError) {
                  self.set('paymentError', lastPaymentError.message);
                } else {
                  self.set(
                    'paymentError',
                    "We're having difficulties processing your request. Please try again later"
                  );
                }

                record.destroyRecord();
              }
            })
            .catch(() => {
              self.set('disabledConfirm', false);
              self.set(
                'paymentError',
                "We're having difficulties processing your request. Please try again later"
              );
              record.destroyRecord();
            });
        })
        .catch(() => {
          self.handlePaymentError(record);
        });
    }
  }
}).reopenClass({
  positionalParams: ['invoice']
});
