import Controller from '@ember/controller';
import ModalController from 'frontend/mixins/controllers/modal';
import ENV from 'frontend/config/environment';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const stripe = new Stripe(ENV.stripe.publishableKey); /* global Stripe */

export default Controller.extend(ModalController, {
  subscription: alias('model.subscription'),
  store: service(),
  cardUpdating: false,

  cardElements: computed(function () {
    return stripe.elements();
  }),

  stripe: computed(function () {
    return stripe;
  }),

  actions: {
    cancel() {
      this.set('cardElements', stripe.elements());
      this.close();
    }
  }
});
