import BaseValidator from 'ember-cp-validations/validators/base';

const ConfirmPassword = BaseValidator.extend({
  validate() {
    if (this.model.relatedModel.get('errors').has('password')) {
      let errors = this.model.relatedModel.get('errors').errorsFor('password');
      return errors.map((error) => error.message).join('\n');
    } else return true;
  }
});

export default ConfirmPassword;
