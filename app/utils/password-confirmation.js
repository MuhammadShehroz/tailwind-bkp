import EmberObject, { observer } from '@ember/object';
import PasswordConfirmationValidations from 'frontend/validations/password-confirmation';

export default EmberObject.extend(PasswordConfirmationValidations, {
  password: '',
  validationsEnabled: false,
  passwordHasChanged: false,
  // eslint-disable-next-line ember/no-observers
  passwordObserver: observer('password', function () {
    this.set('passwordHasChanged', true);
  })
});
