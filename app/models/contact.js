import { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import GenericContact from './generic-contact';
import ConactValidations from 'frontend/validations/contact';

export default GenericContact.extend(ConactValidations, {
  client: belongsTo(),

  firstName: attr({ defaultValue: '' }),
  lastName: attr({ defaultValue: '' }),
  email: attr({ defaultValue: '' }),
  phone: attr(),

  validationsEnabled: false,

  name: computed('firstName', 'lastName', function () {
    return `${this.firstName} ${this.lastName}`;
  }).readOnly()
});
