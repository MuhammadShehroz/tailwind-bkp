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

  fullNumber: [validator('ds-error')],

  number: [
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
    }),
    validator('alias', 'fullNumber'),
    validator('ds-error')
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

  dueOn: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Payment Due',
      disabled: computed('model.{dueOn,validationsEnabled}', validationDisabled)
    }),
    validator('date', {
      description: 'Payment Due',
      disabled: computed('model.{dueOn,validationsEnabled}', validationDisabled)
    })
  ],

  issuedOn: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Invoice Date',
      disabled: computed(
        'model.{issuedOn,validationsEnabled}',
        validationDisabled
      )
    }),
    validator('date', {
      description: 'Invoice Date',
      disabled: computed(
        'model.{issuedOn,validationsEnabled}',
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

  lineItems: validator('has-many')
});
