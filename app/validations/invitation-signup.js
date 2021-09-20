import { computed } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

export default buildValidations({
  base: [
    validator('ds-error', {
      isWarning: true
    })
  ],

  firstName: [
    validator('presence', {
      presence: true,
      description: 'First Name',
      disabled: computed(
        'model.{firstName,validationsEnabled}',
        validationDisabled
      )
    })
  ],

  lastName: [
    validator('presence', {
      presence: true,
      description: 'Last Name',
      disabled: computed(
        'model.{lastName,validationsEnabled}',
        validationDisabled
      )
    })
  ],

  email: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Email Address',
      disabled: computed('model.{email,validationsEnabled}', validationDisabled)
    }),
    validator('format', {
      type: 'email',
      description: 'Email Address',
      disabled: computed('model.{email,validationsEnabled}', validationDisabled)
    })
  ],

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
  ]
});
