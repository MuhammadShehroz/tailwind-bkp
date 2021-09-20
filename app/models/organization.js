import Model, { attr, belongsTo } from '@ember-data/model';
import DocumentDefaults from 'frontend/mixins/models/document-defaults';
import LateFeeLabel from 'frontend/mixins/models/late-fee-label';
import { computed } from '@ember/object';
import { notEmpty, reads, equal } from '@ember/object/computed';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import OrganizationValidations from 'frontend/validations/organization';

const DATE_FORMATS = window.BSN.organization.dateFormats;

export default Model.extend(
  OrganizationValidations,
  DocumentDefaults,
  LateFeeLabel,
  {
    createdAt: attr('date'),
    fax: attr(),
    logoUrl: attr(),
    name: attr(),
    email: attr(),
    phone: attr(),
    taxIdNumber: attr(),
    taxIdName: attr(),
    website: attr(),
    isStripeConnected: attr('boolean'),
    isPaypalConnected: attr('boolean'),
    isCoinbaseConnected: attr('boolean'),
    currentUserRole: attr(),

    // Preferences
    currencyFormat: attr(),
    dateFormat: attr(),
    decimals: attr('number'),
    decimalsSeparator: attr(),
    quantityDecimals: attr('number'),
    thousandsSeparator: attr(),
    timezone: attr('string'),

    // Branding
    headerColor: attr('string', { defaultValue: '#354656' }),
    buttonColor: attr('string', { defaultValue: '#1173E6' }),
    buttonLabelColor: attr('string'),
    buttonHoverColor: attr('string'),

    // Template Defaults
    invoiceMessage: attr(),
    defaultInvoiceMessage: attr(),
    reminderSubject: attr(),
    defaultReminderSubject: attr(),
    reminderMessage: attr(),
    defaultReminderMessage: attr(),
    invoiceNotes: attr(),
    defaultInvoiceNotes: attr(),
    invoiceSubject: attr(),
    defaultInvoiceSubject: attr(),
    thankYouMessage: attr(),
    defaultThankYouMessage: attr(),
    estimateMessage: attr(),
    defaultEstimateMessage: attr(),
    estimateNotes: attr(),
    defaultEstimateNotes: attr(),
    estimateSubject: attr(),
    defaultEstimateSubject: attr(),
    defaultCountry: attr(),
    defaultCity: attr(),
    defaultState: attr(),
    locationDefaults: attr(),

    password: '',

    // Onboarding steps
    invoiceCreatedAt: attr('date'),
    clientCreatedAt: attr('date'),
    estimateCreatedAt: attr('date'),
    invoiceTemplateCreatedAt: attr('date'),
    billingAddress: belongsTo('billing-address', { async: false }),
    subscription: belongsTo('subscription', { async: true }),

    hasBillingAddress: notEmpty('billingAddress'),
    shortAddress: reads('billingAddress.short'),
    hasLogo: notEmpty('logoUrl'),
    validationsEnabled: false,

    currencies: service(),
    terms: service(),
    taxDistributionService: service('taxDistribution'),

    currencyName: computed('currency', 'currencies.all', function () {
      return this.currencies.name(this.currency);
    }),

    netTermsLabel: computed('netTerms', function () {
      if (this.netTerms) {
        return this.terms.findTermByType(this.netTerms, true).label;
      }

      return '';
    }),

    taxDistributionLabel: computed(
      'taxDistribution',
      'taxDistributionService.options',
      function () {
        let { taxDistribution } = this;
        if (taxDistribution) {
          return this.taxDistributionService.options.findBy(
            'value',
            taxDistribution
          ).label;
        }

        return '';
      }
    ),

    initial: computed('name', function () {
      return this.name?.charAt(0);
    }),

    initials: computed('name', function () {
      if (!this.name) {
        return '';
      }

      let [first, last] = this.name.split(' ');
      return `${first.charAt(0)}${last ? ` ${last.charAt(0)}` : ''}`;
    }),

    taxIdNameWithDefault: computed('taxIdName', function () {
      return this.taxIdName || 'Tax ID';
    }),

    buildBillingAddress() {
      if (!this.hasBillingAddress) {
        this.set('billingAddress', this.store.createRecord('billing-address'));
      }

      return this;
    },

    jsDateFormat: computed('dateFormat', function () {
      let { dateFormat } = this;

      if (dateFormat) {
        return DATE_FORMATS[dateFormat].js_format;
      }

      return undefined;
    }),

    currentUserIsOwner: equal('currentUserRole', 'owner'),

    domId: computed('id', function () {
      if (this.id) {
        return `organization-${this.id}`;
      } else {
        return `organization-${guidFor(this)}`;
      }
    })
  }
);
