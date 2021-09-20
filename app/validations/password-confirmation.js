import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { validator, buildValidations } from 'ember-cp-validations';

export default buildValidations({
  password: [
    validator('presence', {
      presence: true,
      description: 'Password',
      disabled: computed(
        'model.{passwordHasChanged,validationsEnabled}',
        function () {
          return !(
            this.model.passwordHasChanged || this.model.validationsEnabled
          );
        }
      )
    }),
    validator('length', {
      min: 6,
      max: 128,
      description: 'Password',
      disabled: computed(
        'model.{passwordHasChanged,validationsEnabled}',
        function () {
          return !(
            this.model.passwordHasChanged || this.model.validationsEnabled
          );
        }
      )
    }),
    validator('confirm-password', {
      dependentKeys: ['model.relatedModel.isValid'],
      disabled: reads('model.relatedModel.isValid')
    })
  ]
});
