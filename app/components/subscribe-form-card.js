import Component from '@ember/component';
import { computed, set } from '@ember/object';
import { inject as service } from '@ember/service';
import ENV from 'frontend/config/environment';
import { dateFormat } from 'frontend/helpers/date-format';

export default Component.extend({
  store: service(),
  organization: service(),

  init() {
    this._super(...arguments);

    set(
      this,
      'stripe',
      new Stripe(ENV.stripe.publishableKey)
    ); /* global Stripe */
  },

  cardElements: computed('stripe', function () {
    return this.stripe.elements();
  }),

  actions: {
    subscribeAction() {
      this.controller.send('startLoading', 'Creating your subscription...');

      let adapter = this.store.adapterFor('subscription');
      adapter.setupIntent().then((setupIntent) => {
        let subscription = this.model;
        let context = this;

        this.stripe
          .handleCardSetup(setupIntent.key, this.cardElements)
          .then(function (result) {
            if (result.error) {
              context.flashMessages.add({
                type: 'error',
                message: 'Invalid credit card attributes'
              });

              context.controller.send('endLoading');
            } else {
              subscription.set('cardToken', result.setupIntent.payment_method);

              subscription.save().then((subscription) => {
                if (subscription.userSubscribed && !subscription.trialEnded) {
                  context.flashMessages.add({
                    type: 'success',
                    title: 'Saved Successfully',
                    message: `Your free trial will end on ${dateFormat(
                      subscription.validUntil,
                      context.organization.current.jsDateFormat
                    )}, and then your Blinksale subscription will kick in.`,

                    timeout: context.defaultTimeout
                  });
                } else {
                  context.flashMessages.add({
                    type: 'success',
                    title: 'Saved Successfully',
                    message: 'Subscription created successfully.',
                    timeout: context.defaultTimeout
                  });
                }

                context.controller.send('endLoading');
              });
            }
          });
      });
    },

    backToPlanFormAction() {
      if (this.backToPlanForm) {
        this.backToPlanForm();
      }
    }
  }
});
