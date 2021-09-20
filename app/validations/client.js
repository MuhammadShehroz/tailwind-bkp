import { computed } from '@ember/object';
import { or, not } from '@ember/object/computed';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

export default buildValidations({
  base: [
    validator('ds-error', {
      isWarning: true
    })
  ],

  companyName: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Company Name',
      disabled: or('model.isPerson', 'model.companyNameValidationDisabled')
    })
  ],

  firstName: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'First Name',
      disabled: or('model.isCompany', 'model.firstNameValidationDisabled')
    })
  ],

  lastName: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Last Name',
      disabled: or('model.isCompany', 'model.lastNameValidationDisabled')
    })
  ],

  email: [
    validator('ds-error', true),
    validator('format', {
      type: 'email',
      allowBlank: true,
      description: 'Email Address',
      disabled: computed('model.{email,validationsEnabled}', validationDisabled)
    })
  ],

  website: [
    validator('ds-error', true),
    validator('format', {
      type: 'url',
      allowBlank: true,
      description: 'Website',
      disabled: computed(
        'model.{website,validationsEnabled}',
        validationDisabled
      )
    })
  ],

  lateFee: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Late Fee',
      disabled: not('model.hasLateFee'),
      dependentKeys: ['model.hasLateFee']
    })
  ],

  contacts: validator('has-many')
});
