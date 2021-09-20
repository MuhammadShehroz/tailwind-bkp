import Model, { attr } from '@ember-data/model';
import moment from 'moment';
import { equal, not, notEmpty } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  coupon: validator('ds-error', true)
});

export default Model.extend(Validations, {
  planId: attr(),
  status: attr(),
  isTrial: attr('boolean'),
  validUntil: attr('date'),
  userSubscribed: attr('boolean', { default: false }),
  isComped: attr('boolean', { default: false }),
  planName: attr(),
  paymentFrequency: attr(),
  planUpdate: attr('boolean'),
  isActive: attr(),
  coupon: attr(),
  applyCoupon: attr(),
  validCoupon: attr('boolean'),

  // card details
  cardToken: attr(),
  cardNumber: attr('number'),
  cardExpirationMonth: attr('number'),
  cardExpirationYear: attr('number'),

  notSubscribed: not('userSubscribed'),
  trialEnded: not('isTrial'),

  payMonthly: equal('paymentFrequency', 'month'),
  hasPaymentMethod: notEmpty('cardNumber'),

  planService: service('plan'),

  remainingDays: computed('validUntil', function () {
    return moment.utc(this.validUntil).diff(moment(), 'days');
  }),

  cardExpirationMonthTwoDigits: computed('cardExpirationMonth', function () {
    return String(this.cardExpirationMonth).padStart(2, '0');
  }),

  updateCreditCard() {
    return this.store.adapterFor('subscription').updateCreditCard(this);
  },

  planPrice: computed('planId', function () {
    return this.planService.getPlan(this.planId).price;
  }),

  cancelSubscription() {
    let adapter = this.store.adapterFor(this.constructor.modelName);
    return adapter.cancelSubscription(this.id);
  },

  activateCoupons(token, coupon) {
    let adapter = this.store.adapterFor('subscription');
    return adapter.activateCoupons(this.id, token, coupon);
  },

  verifyCoupon() {
    let adapter = this.store.adapterFor('subscription');
    return adapter.verifyCoupon(this.id, this.coupon);
  },

  applicableCoupon: computed('applyCoupon', 'planId', function () {
    return (
      this.applyCoupon && this.planId === this.planService.monthlyPlanKey()
    );
  })
});
