import Model, { attr } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';
import { collectionAction } from 'frontend/lib/restless-methods';
import { inject as service } from '@ember/service';
import validationDisabled from 'frontend/utils/validation-disabled';
import { computed } from '@ember/object';

const Validations = buildValidations({
  base: [
    validator('ds-error', {
      isWarning: true
    })
  ],

  toRecipients: [
    validator('presence', {
      presence: true,
      description: 'To Recipients',
      message: '{description} must have at least one recipient',
      disabled: computed(
        'model.{toRecipients,validationsEnabled}',
        validationDisabled
      )
    }),
    validator('collection', true)
  ]
});

export default Model.extend(Validations, {
  deliverableId: attr(),
  deliverableType: attr(),
  kind: attr(),
  message: attr(),
  subject: attr('string'),
  toRecipients: attr(),
  ccRecipients: attr(),
  bccRecipients: attr(),
  pdfAttached: attr('boolean'),
  includeAch: attr('boolean'),
  includeStripe: attr('boolean'),
  includePaypal: attr('boolean'),
  includeCoinbase: attr('boolean'),

  ajax: service(),

  newWithDefaults: collectionAction('new', { method: 'get' }),

  validationsEnabled: false,

  buildNew() {
    return this.newWithDefaults({
      delivery: {
        // eslint-disable-next-line camelcase
        deliverable_id: this.deliverableId,
        // eslint-disable-next-line camelcase
        deliverable_type: this.deliverableType,
        kind: this.kind
      }
    }).then((data) => {
      let attrs = this.store.normalize('delivery', data.delivery).data
        .attributes;
      this.setProperties(attrs);
      return this;
    });
  }
});
