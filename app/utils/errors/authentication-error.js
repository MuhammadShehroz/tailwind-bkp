export default class AuthenticationError extends Error {
  name = 'Authentication Error';

  message;

  constructor(message = 'You need to sign in or sign up before continuing.') {
    super();
    this.message = message;
  }
}
