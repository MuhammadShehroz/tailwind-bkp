export default class StripeCardError extends Error {
  name = 'Card Processing Error';

  message;

  constructor(error) {
    super();
    this.message = error;
  }
}
