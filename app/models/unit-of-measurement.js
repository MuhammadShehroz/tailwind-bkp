import { computed } from '@ember/object';
import { alias, notEmpty } from '@ember/object/computed';
import Model, { attr, belongsTo } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

const Validations = buildValidations({
  name: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Unit Name',
      disabled: computed('model.{name,validationsEnabled}', validationDisabled)
    })
  ]
});

export default Model.extend(Validations, {
  name: attr(),
  code: attr(),
  organization: belongsTo(),
  validationsEnabled: false,
  isEditable: notEmpty('organization.id'),

  modelName: alias('constructor.modelName')
});
