import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  updateCreditCard(object) {
    let url = `${this.buildURL('subscription', object.id)}/update_credit_card`;
    return this.ajax(url, 'PUT', {
      data: {
        // eslint-disable-next-line camelcase
        credit_card_id: object.cardToken
      }
    });
  },

  setupIntent() {
    let url = `${this.buildURL('subscription')}/setup_intent`;

    return this.ajax(url, 'GET');
  },

  cancelSubscription(id) {
    let url = `${this.buildURL('subscription', id)}/cancel`;
    return this.ajax(url, 'PUT');
  },

  activateCoupons(id, token, coupon) {
    let url = `${this.buildURL('subscription', id)}/activate_coupons`;
    return this.ajax(url, 'PUT', {
      data: {
        token,
        coupon
      }
    });
  },

  verifyCoupon(id, coupon) {
    let url = `${this.buildURL('subscription', id)}/verify_coupon`;
    return this.ajax(url, 'PUT', {
      data: {
        coupon
      }
    });
  }
});
