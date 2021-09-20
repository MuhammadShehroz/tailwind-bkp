import { computed } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

export default buildValidations({
  base: [
    validator('ds-error', {
      isWarning: true
    })
  ],

  permissions: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      disabled: computed(
        'model.{permissions,validationsEnabled}',
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
  ]
});
