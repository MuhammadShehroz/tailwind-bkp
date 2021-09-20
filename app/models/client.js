import { attr, hasMany, belongsTo } from '@ember-data/model';
import DependentRelationships from 'frontend/mixins/models/dependent-relationships';
import DocumentDefaults from 'frontend/mixins/models/document-defaults';
import { computed } from '@ember/object';
import { and, not, reads, notEmpty, or } from '@ember/object/computed';
import { guidFor } from '@ember/object/internals';
import GenericContact from './generic-contact';
import ClientValidations from 'frontend/validations/client';

const company = 'company';
const person = 'person';

export default GenericContact.extend(
  ClientValidations,
  DependentRelationships,
  DocumentDefaults,
  {
    archivedAt: attr('date'),
    companyName: attr({ defaultValue: '' }),
    email: attr({ defaultValue: '' }),
    fax: attr(),
    firstName: attr({ defaultValue: '' }),
    identifier: attr(),
    kind: attr({ defaultValue: company }),
    lastName: attr({ defaultValue: '' }),
    name: attr(),
    phone: attr(),
    taxIdNumber: attr(),
    taxIdName: attr(),
    website: attr({ defaultValue: '' }),

    validationsEnabled: false,

    billingAddress: belongsTo('billing-address', { async: false }),
    contacts: hasMany('contact', { async: true }),
    hasBillingAddress: notEmpty('billingAddress'),
    invoices: hasMany('invoice'),
    shortAddress: reads('billingAddress.short'),
    hasEmail: notEmpty('email'),

    isPerson: not('isCompany'),

    validationsDisabled: not('validationsEnabled'),

    companyNameNotModified: computed('companyName', function () {
      let attrs = this.changedAttributes();
      let hasChangedAttribute = Object.keys(attrs).includes('companyName');
      return !hasChangedAttribute;
    }),

    firstNameNotModified: computed('firstName', function () {
      let attrs = this.changedAttributes();
      let hasChangedAttribute = Object.keys(attrs).includes('firstName');
      return !hasChangedAttribute;
    }),

    lastNameNotModified: computed('lastName', function () {
      let attrs = this.changedAttributes();
      let hasChangedAttribute = Object.keys(attrs).includes('lastName');
      return !hasChangedAttribute;
    }),

    companyNameValidationDisabled: and(
      'companyNameNotModified',
      'validationsDisabled'
    ),

    firstNameValidationDisabled: and(
      'firstNameNotModified',
      'validationsDisabled'
    ),

    lastNameValidationDisabled: and(
      'lastNameNotModified',
      'validationsDisabled'
    ),

    hasPhone: notEmpty('phone'),
    hasFax: notEmpty('fax'),
    hasWebsite: notEmpty('website'),
    hasTaxIdNumber: notEmpty('taxIdNumber'),
    hasTaxIdName: notEmpty('taxIdName'),
    hasTaxId: or('taxIdName', 'hasTaxIdNumber'),
    hasIdentifier: notEmpty('identifier'),

    hasContactInfo: or(
      'hasBillingAddress',
      'hasPhone',
      'hasFax',
      'hasEmail',
      'hasWebsite',
      'hasTaxId',
      'hasIdentifier'
    ),

    firstLetter: computed('name', function () {
      if (!this.name) {
        return '';
      }

      return this.name.charAt(0).toUpperCase();
    }),

    archive() {
      let adapter = this.store.adapterFor(this.constructor.modelName);
      return adapter.archive(this.id);
    },

    unarchive() {
      let adapter = this.store.adapterFor(this.constructor.modelName);
      return adapter.unarchive(this.id);
    },

    buildDependencies() {
      return this.buildBillingAddress();
    },

    buildBillingAddress() {
      if (!this.hasBillingAddress) {
        this.set('billingAddress', this.store.createRecord('billing-address'));
      }

      return this;
    },

    addContact() {
      let contact = this.store.createRecord('contact');
      this.contacts.pushObject(contact);
      return this;
    },

    isCompany: computed('kind', {
      get() {
        return this.kind === company;
      },

      set(key, value) {
        if (value) {
          this.setProperties({
            kind: company,
            firstName: null,
            lastName: null
          });
        } else {
          this.setProperties({ kind: person, companyName: null });
        }

        return value;
      }
    }),

    domId: computed('id', function () {
      if (this.id) {
        return `client-${this.id}`;
      } else {
        return `client-${guidFor(this)}`;
      }
    }),

    taxIdNameWithDefault: computed('taxIdName', function () {
      return this.taxIdName || 'Tax ID';
    })
  }
);
