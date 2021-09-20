import Component from '@ember/component';
import { computed } from '@ember/object';
import FormBase from 'frontend/mixins/form-base';
import { inject as service } from '@ember/service';

export default Component.extend(FormBase, {
  tagName: 'form',
  novalidate: true,
  title: 'Subscription Saved',
  message: 'Subscription saved successfully.',
  attributeBindings: ['novalidate'],
  defaultMonthlyPrice: 15,
  validCoupon: false,

  store: service(),
  planService: service('plan'),

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

  saveChain() {
    return this.model.save().then(() => {
      this.close();
      this.flashMessages.add({
        type: 'success',
        title: this.title,
        message: this.message,
        timeout: this.defaultTimeout
      });
    });
  },

  actions: {
    cancel() {
      this._super();
      this.close();
    },

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
