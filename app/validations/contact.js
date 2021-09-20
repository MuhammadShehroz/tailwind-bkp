import { computed } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

export default buildValidations({
  firstName: [
    validator('ds-error', true),
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
    validator('ds-error', true),
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
    validator('format', {
      type: 'email',
      description: 'Email Address',
      disabled: computed('model.{email,validationsEnabled}', validationDisabled)
    })
  ]
});
