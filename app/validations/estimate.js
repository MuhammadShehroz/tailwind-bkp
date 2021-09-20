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

  number: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Number',
      disabled: computed(
        'model.{number,validationsEnabled}',
        validationDisabled
      )
    }),
    validator('number', {
      gte: 0,
      lte: 2147483647,
      integer: true,
      description: 'Number',
      disabled: computed(
        'model.{number,validationsEnabled}',
        validationDisabled
      )
    })
  ],

  client: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Client',
      disabled: not('model.validationsEnabled')
    })
  ],

  currency: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Currency',
      disabled: not('model.validationsEnabled')
    })
  ],

  issuedOn: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Estimate Date',
      disabled: computed(
        'model.{issuedOn,validationsEnabled}',
        validationDisabled
      )
    }),
    validator('date', {
      description: 'Estimate Date',
      disabled: computed(
        'model.{issuedOn,validationsEnabled}',
        validationDisabled
      )
    })
  ],

  lineItems: validator('has-many')
});
