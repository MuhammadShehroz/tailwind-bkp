import Controller from '@ember/controller';
import FormBase from 'frontend/mixins/form-base';
import { alias } from '@ember/object/computed';

const marketingReasons = [
  'Track your invoice activity with ease',
  'Professional & customizable templates',
  'Send invoices from your own email address',
  'Stripe™ & PayPal™ integration',
  'Free &friendly support by phone or email'
];

export default Controller.extend(FormBase, {
  tagName: 'form',
  queryParams: ['token'],
  validations: alias('model.validations.attrs'),
  marketingReasons,

  saveChain(options) {
    return this.model.save(options).then(() => {
      this.transitionToRoute('login');
      this.flashMessages.add({
        type: 'success',
        title: 'Invitation Accepted',
        message: 'Welcome to Blinksale!',
        timeout: this.defaultTimeout
      });
    });
  }
});
