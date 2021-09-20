import InvalidError from 'frontend/utils/errors/invalid-error';

export default class SignupError extends InvalidError {
  name = `Couldn't Complete Signup`;
}
