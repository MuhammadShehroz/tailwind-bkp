import { computed } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

export default buildValidations({
  base: [
    validator('ds-error', {
      isWarning: true
    })
  ],

  apiKey: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'API Key',
      disabled: computed(
        'model.{apiKey,validationsEnabled}',
        validationDisabled
      )
    })
  ],

  coinbaseWebhookSecret: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Webhook Secret',
      disabled: computed(
        'model.{coinbaseWebhookSecret,validationsEnabled}',
        validationDisabled
      )
    })
  ]
});
