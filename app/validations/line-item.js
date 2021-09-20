import { computed } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

const MAX_NUMBER = 2147483647;

export default buildValidations({
  name: [
    validator('presence', {
      presence: true,
      description: 'Item Name',
      disabled: computed('model.{name,validationsEnabled}', validationDisabled)
    })
  ],

  price: [
    validator('presence', {
      presence: true,
      description: 'Price',
      disabled: computed('model.{price,validationsEnabled}', validationDisabled)
    }),
    validator('number', {
      gte: 0,
      lte: MAX_NUMBER,
      description: 'Price',
      disabled: computed('model.{price,validationsEnabled}', validationDisabled)
    })
  ],

  quantity: [
    validator('presence', {
      presence: true,
      description: 'Quantity',
      disabled: computed(
        'model.{quantity,validationsEnabled}',
        validationDisabled
      )
    }),
    validator('number', {
      gte: 1,
      lte: MAX_NUMBER,
      description: 'Quantity',
      disabled: computed(
        'model.{quantity,validationsEnabled}',
        validationDisabled
      )
    })
  ]
});
