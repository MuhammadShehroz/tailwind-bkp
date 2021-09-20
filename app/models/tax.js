import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Model, { attr } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';
import validationDisabled from 'frontend/utils/validation-disabled';

const Validations = buildValidations({
  name: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Tax Name',
      disabled: computed('model.{name,validationsEnabled}', validationDisabled)
    })
  ],

  percent: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      description: 'Percent',
      disabled: computed(
        'model.{percent,validationsEnabled}',
        validationDisabled
      )
    }),
    validator('number', {
      gt: 0,
      lte: 100,
      allowString: false,
      description: 'Percent',
      disabled: computed(
        'model.{percent,validationsEnabled}',
        validationDisabled
      )
    })
  ]
});

export default Model.extend(Validations, {
  name: attr(),
  percent: attr('number'),

  validationsEnabled: false,

  nameAndPercent: computed('name', 'percent', function () {
    return `${this.name} (${this.percent}%)`;
  }),

  modelName: alias('constructor.modelName')
});
