import Component from '@ember/component';
import { computed } from '@ember/object';

const inputStyles = {
  base: {
    fontFamily: 'Inter, Helvetica, sans-serif',
    fontSize: '16px',
    fontSmoothing: 'antialiased',
    backgroundColor: 'transparent',
    padding: '6px',

    '::placeholder': {
      color: '#354656'
    }
  }
};

export default Component.extend({
  inputStyles,

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
  })
});
