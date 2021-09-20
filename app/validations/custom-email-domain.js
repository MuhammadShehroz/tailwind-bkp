import { computed } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

export default buildValidations({
  base: [
    validator('ds-error', {
      isWarning: true
    })
  ],

  email: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Email',
      disabled: computed('model.{email,validationsEnabled}', validationDisabled)
    }),
    validator('format', {
      type: 'email',
      description: 'Email',
      disabled: computed('model.{email,validationsEnabled}', validationDisabled)
    })
  ],

  domain: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Domain',
      disabled: computed(
        'model.{domain,validationsEnabled}',
        validationDisabled
      )
    }),
    validator('format', {
      regex: /^([a-zA-Z0-9\-_]+(\.[a-zA-Z0-9]+)+.*)/,
      description: 'Domain',
      message: '{description} must be a valid domain name',
      disabled: computed(
        'model.{domain,validationsEnabled}',
        validationDisabled
      )
    })
  ]
});
