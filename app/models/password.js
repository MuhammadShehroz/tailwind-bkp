import { computed } from '@ember/object';
import Model, { attr } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

const Validations = buildValidations({
  password: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Password',
      disabled: computed(
        'model.{password,validationsEnabled}',
        validationDisabled
      )
    }),
    validator('length', {
      min: 6,
      max: 128,
      description: 'Password',
      disabled: computed(
        'model.{password,validationsEnabled}',
        validationDisabled
      )
    })
  ],

  passwordConfirmation: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Password Confirmation',
      disabled: computed(
        'model.{passwordConfirmation,validationsEnabled}',
        validationDisabled
      )
    }),
    validator('confirmation', {
      on: 'password',
      description: 'Password Confirmation',
      message: 'Passwords do not match',
      disabled: computed(
        'model.{passwordConfirmation,validationsEnabled}',
        validationDisabled
      )
    })
  ]
});

export default Model.extend(Validations, {
  password: attr('string', { defaultValue: '' }),
  passwordConfirmation: attr('string', { defaultValue: '' }),

  validationsEnabled: false
});
