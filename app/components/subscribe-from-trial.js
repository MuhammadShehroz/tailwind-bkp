import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { not, reads } from '@ember/object/computed';
import { computed, set } from '@ember/object';
import ENV from 'frontend/config/environment';
import FormBase from 'frontend/mixins/form-base';
import { dateFormat } from 'frontend/helpers/date-format';
import InvalidError from 'frontend/utils/errors/invalid-error';
import StripeCardError from 'frontend/utils/errors/stripe-card-error';

export default Component.extend(FormBase, {
  tagName: 'form',
  novalidate: true,
  attributeBindings: ['novalidate'],
  organization: service(),
  planService: service('plan'),
  currentOrganizationId: reads('organization.organizationId'),
  store: service(),
  metrics: service(),
  defaultMonthlyPrice: 15,
  subscribeDisabled: reads('noPlanSelected'),

  init() {
    this._super(...arguments);

    set(
      this,
      'stripe',
      new Stripe(ENV.stripe.publishableKey)
    ); /* global Stripe */
  },

  monthlyPrice: computed(
    'coupon.{amountOff,percentOff}',
    'defaultMonthlyPrice',
    'model.coupon',
    function () {
      let defaultPrice = this.defaultMonthlyPrice;
      if (this.model.coupon && this.coupon) {
        return this.coupon.discountedPrice(defaultPrice);
      }

      return defaultPrice;
    }
  ),

  monthlyLabel: computed('monthlyPrice', 'validCoupon', function () {
    if (this.validCoupon) {
      return `Monthly ($15/mo), $${this.monthlyPrice} first month`;
    }

    return `Monthly ($${this.monthlyPrice}/mo)`;
  }),

  monthly: computed(function () {
    return this.planService.monthlyPlanKey();
  }),

  annually: computed(function () {
    return this.planService.anuallyPlanKey();
  }),

  cardElements: computed('stripe', function () {
    return this.stripe.elements();
  }),

  showTrialMessage: computed('model.{remainingDays,status}', function () {
    let { model } = this;

    return !(model.status === 'trialing' && model.remainingDays < 0);
  }).readOnly(),

  trackSubscriptionEvent() {
    this.metrics.trackEvent({
      event: 'billing_capture',
      type: this.planService.gtmPlan(this.model.planId)
    });
  },

  saveChain() {
    let adapter = this.store.adapterFor('subscription');
    return adapter
      .setupIntent()
      .then((setupIntent) =>
        this.stripe.handleCardSetup(setupIntent.key, this.cardElements)
      )
      .then((result) => {
        if (result.error) {
          throw new StripeCardError('Invalid credit card attributes');
        } else {
          return Promise.resolve(result);
        }
      })
      .then((success) => {
        this.model.set('cardToken', success.setupIntent.payment_method);
        if (not('model.validCoupon')) {
          this.model.set('coupon', '');
        }

        return this.model.save().catch((error) => {
          throw new InvalidError(error);
        });
      })
      .then(() => {
        this.trackSubscriptionEvent();
        if (this.model.userSubscribed && !this.model.trialEnded) {
          this.flashMessages.add({
            type: 'success',
            title: 'Saved Successfully',
            message: `Your free trial will end on ${dateFormat(
              this.model.validUntil,
              this.organization.current.jsDateFormat
            )}, and then your Blinksale subscription will kick in.`,

            timeout: this.defaultTimeout
          });
        } else {
          this.flashMessages.add({
            type: 'success',
            title: 'Saved Successfully',
            message: 'Subscription created successfully.',
            timeout: this.defaultTimeout
          });
        }
      });
  },

  actions: {
    verifyCoupon() {
      if (this.model.coupon) {
        this.model
          .verifyCoupon()
          .then((result) => {
            let coupon = this.store.createRecord('coupon', {
              amountOff: result.coupon.amount_off,
              percentOff: result.coupon.percent_off,
              valid: result.coupon.valid
            });
            this.model.set('validCoupon', true);
            this.setProperties({
              coupon,
              validCoupon: true
            });
          })
          .catch(() => {
            this.model.set('validCoupon', true);
            this.setProperties({
              coupon: null,
              validCoupon: false
            });

            this.model.set('validCoupon', false);
            this.flashMessages.add({
              type: 'error',
              title: 'Invalid Coupon',
              message: 'Unable to apply this coupon',
              timeout: this.defaultTimeout
            });
          });
      }
    }
  }
});
