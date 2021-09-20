import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

export default buildValidations({
  base: [
    validator('ds-error', {
      isWarning: true
    })
  ],

  templateName: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Template Name',
      disabled: computed(
        'model.{templateName,validationsEnabled}',
        validationDisabled
      )
    })
  ],

  currency: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Currency',
      disabled: computed(
        'model.{currency,validationsEnabled}',
        validationDisabled
      )
    })
  ],

  frequencyType: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Invoice Frequency',
      disabled: computed(
        'model.{frequencyType,validationsEnabled}',
        validationDisabled
      )
    })
  ],

  startSendingOn: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Invoice Date',
      disabled: or(
        'model.multipleSchedule',
        'model.startSendingOnValidationDisabled'
      ),

      dependentKeys: ['model.singleSchedule']
    }),
    validator('date', {
      description: 'Invoice Date',
      disabled: or(
        'model.multipleSchedule',
        'model.startSendingOnValidationDisabled'
      ),

      dependentKeys: ['model.singleSchedule']
    })
  ],

  lateFee: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Late Fee',
      disabled: or('model.hasntLateFee', 'model.lateFeeValidationDisabled'),
      dependentKeys: ['model.hasLateFee']
    })
  ],

  netTermsDays: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Payment Due',
      disabled: or(
        'model.excludeOtherNetTerms',
        'model.netTermsDaysValidationDisabled'
      ),

      dependentKeys: ['model.netTerms']
    })
  ],

  lineItems: validator('has-many'),
  recurringSchedules: validator('has-many')
});
