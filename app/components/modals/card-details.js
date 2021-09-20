import Component from '@ember/component';
import { computed } from '@ember/object';
import FormBase from 'frontend/mixins/form-base';
import { inject as service } from '@ember/service';
import StripeCardError from 'frontend/utils/errors/stripe-card-error';

const inputStyles = {
  base: {
    fontFamily: 'Inter, Helvetica, sans-serif',
    fontSize: '16px',
    fontSmoothing: 'antialiased',
    backgroundColor: 'white',

    '::placeholder': {
      color: '#354656'
    }
  }
};

export default Component.extend(FormBase, {
  tagName: 'form',
  inputStyles,

  store: service(),

  cardNumberOptions: computed('inputStyles', function () {
    return {
      style: this.inputStyles,
      placeholder: 'Credit card number'
    };
  }),

  cardExpiryOptions: computed('inputStyles', function () {
    return {
      style: this.inputStyles,
      placeholder: 'MM / YY'
    };
  }),

  cardCvcOptions: computed('inputStyles', function () {
    return {
      style: this.inputStyles,
      placeholder: 'CVV'
    };
  }),

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
        return this.model.updateCreditCard();
      })
      .then(() => {
        this.flashMessages.add({
          type: 'success',
          title: 'Saved Successfully',
          message: 'Credit card has been updated',
          timeout: this.defaultTimeout
        });
        this.model.reload();
        this.set('cardElements', this.cardElements);
        this.close();
      });
  },

  actions: {
    cancel() {
      this.close();
    }
  }
});
