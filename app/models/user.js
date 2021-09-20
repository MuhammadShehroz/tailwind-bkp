import Model, { attr } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';
import { computed } from '@ember/object';
import { notEmpty, readOnly, or } from '@ember/object/computed';
import { memberAction } from 'frontend/lib/restless-methods';
import { inject as service } from '@ember/service';

const Validations = buildValidations({
  firstName: validator('presence', true),
  lastName: validator('presence', true),
  email: [
    validator('ds-error', true),
    validator('format', { allowBlank: true, type: 'email' })
  ],

  password: [
    validator('ds-error', true),
    validator('length', {
      allowBlank: true,
      min: 6,
      max: 128,
      disabled: readOnly('model.skipPasswordValidation')
    })
  ],

  currentPassword: [
    validator('ds-error', true),
    validator('length', {
      allowBlank: true,
      min: 6,
      max: 128,
      disabled: readOnly('model.skipPasswordValidation')
    })
  ]
});

export default Model.extend(Validations, {
  ajax: service(),

  firstName: attr(),
  lastName: attr(),
  email: attr(),
  password: attr(),
  currentPassword: attr(),
  createdAt: attr('date'),
  confirmedAt: attr('date'),
  avatarWebUrl: attr(),
  authorizationToken: attr(),
  skipPasswordValidation: true,
  defaultOrganizationId: attr('string'),

  hasAvatar: notEmpty('avatarWebUrl'),

  name: computed('firstName', 'lastName', function () {
    return [this.firstName, this.lastName].compact().join(' ');
  }),

  initials: computed('firstName', 'lastName', function () {
    return [this.firstName, this.lastName]
      .compact()
      .map((n) => n.charAt(0))
      .join('');
  }),

  nameOrEmail: or('name', 'email'),

  resendVerification: memberAction('resend_confirmation', {
    method: 'POST'
  })
});
