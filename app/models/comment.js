import { computed } from '@ember/object';
import Model, { attr } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

const Validations = buildValidations({
  message: [
    validator('presence', {
      presence: true,
      description: 'Message',
      disabled: computed(
        'model.{message,validationsEnabled}',
        validationDisabled
      )
    })
  ]
});

export default Model.extend(Validations, {
  message: attr('string', { defaultValue: '' }),

  validationsEnabled: false,

  save(document) {
    let adapter = this.store.adapterFor(this.constructor.modelName);
    return adapter.save(this.message, document);
  }
});
