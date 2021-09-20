import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

export default buildValidations({
  base: [
    validator('ds-error', {
      isWarning: true
    })
  ],

  name: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Business Name',
      disabled: computed('model.{name,validationsEnabled}', validationDisabled)
    })
  ],

  email: [
    validator('ds-error', true),
    validator('format', {
      type: 'email',
      allowBlank: true,
      description: 'Business Email',
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

  invoiceSubject: [validator('ds-error')],
  invoiceMessage: [validator('ds-error')],
  reminderSubject: [validator('ds-error')],
  reminderMessage: [validator('ds-error')],
  invoiceNotes: [validator('ds-error')],
  thankYouMessage: [validator('ds-error')],
  estimateSubject: [validator('ds-error')],
  estimateMessage: [validator('ds-error')],
  estimateNotes: [validator('ds-error')],

  contacts: validator('has-many')
});
