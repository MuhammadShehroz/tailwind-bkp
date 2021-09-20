import Document from 'frontend/mixins/models/document';
import DocumentPreview from 'frontend/mixins/models/document/preview';
import ConvertableDocument from './convertable-document';
import DocumentDuplicate from 'frontend/mixins/models/document/duplicate';
import LateFeeLabel from 'frontend/mixins/models/late-fee-label';
import { attr, hasMany } from '@ember-data/model';
import moment from 'moment';
import { and, not, readOnly, reads, equal } from '@ember/object/computed';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';
import { capitalize } from '@ember/string';
import { inject as service } from '@ember/service';
import { assign } from '@ember/polyfills';
import { collectionAction } from 'frontend/lib/restless-methods';
import { PromiseObject } from '@ember-data/store/-private';
import InvoiceTemplateValidations from 'frontend/validations/invoice-template';

export default ConvertableDocument.extend(
  Document,
  InvoiceTemplateValidations,
  DocumentPreview,
  DocumentDuplicate,
  LateFeeLabel,
  {
    frequencyTypeLabels: service(),
    templateName: attr('string', { defaultValue: '' }),
    frequencyQuantity: attr('number', { defaultValue: 1 }),
    frequencyType: attr('string', { defaultValue: '' }),
    netTerms: attr(),
    message: attr(),
    recurringSchedulesCount: attr('number'),
    sendInvoicesAt: attr(),
    singleSchedule: attr('boolean'),
    startSendingOn: attr('date'),
    recurringSchedules: hasMany('recurring-schedule', { async: false }),
    cachedTotalRecurring: attr('number'),
    pdfAttached: attr('boolean'),
    includeAch: attr('boolean'),
    includeStripe: attr('boolean'),
    includePaypal: attr('boolean'),
    hour: attr(),
    minute: attr(),
    meridian: attr(),
    netTermsDays: attr('number', { allowNull: true }),
    hasLateFee: attr('boolean'),
    lateFeeKind: attr({ allowNull: true }),
    lateFeeInterval: attr({ allowNull: true }),
    lateFee: attr('number'),

    lineItems: hasMany('invoiceTemplateLineItem', { async: false }),

    isInvoiceTemplate: true,
    modelLabel: 'invoice template',
    validationsEnabled: false,
    hasntLateFee: not('hasLateFee'),
    multipleSchedule: not('singleSchedule'),

    identifier: readOnly('templateName'),
    unitOfMeasurement: reads('currentOrganization.unitOfMeasurement'),
    unitPrice: reads('currentOrganization.unitPrice'),
    frequency: computed(
      'frequencyQuantity',
      'frequencyType',
      'frequencyTypeLabels.labels',
      function () {
        if (!this.frequencyType) {
          return;
        }

        if (this.frequencyQuantity > 1) {
          let frequencyAmount = pluralize(capitalize(this.frequencyType));
          return `Every ${this.frequencyQuantity} ${frequencyAmount}`;
        }

        return capitalize(this.frequencyTypeLabels.labels[this.frequencyType]);
      }
    ),

    lateFeeNotModified: computed('lateFee', function () {
      let attrs = this.changedAttributes();
      let hasChangedAttribute = Object.keys(attrs).includes('lateFee');
      return !hasChangedAttribute;
    }),

    startSendingOnNotModified: computed('startSendingOn', function () {
      let attrs = this.changedAttributes();
      let hasChangedAttribute = Object.keys(attrs).includes('startSendingOn');
      return !hasChangedAttribute;
    }),

    netTermsDaysNotModified: computed('netTermsDays', function () {
      let attrs = this.changedAttributes();
      let hasChangedAttribute = Object.keys(attrs).includes('netTermsDays');
      return !hasChangedAttribute;
    }),

    lateFeeValidationDisabled: and('lateFeeNotModified', 'validationsDisabled'),

    startSendingOnValidationDisabled: and(
      'startSendingOnNotModified',
      'validationsDisabled'
    ),

    netTermsDaysValidationDisabled: and(
      'netTermsDaysNotModified',
      'validationsDisabled'
    ),

    otherNetTerms: equal('netTerms', 'other'),

    excludeOtherNetTerms: not('otherNetTerms'),

    buildNew() {
      return this.newDefaults().then((data) => {
        let newAttrs = this.store.normalize(
          'invoice-template',
          data.invoice_template
        ).data.attributes;

        this.setProperties(newAttrs);

        return this;
      });
    },

    previewHtml: collectionAction('preview', {
      method: 'get',
      ajaxOptions: { dataType: 'html' }
    }),

    previewDoc(options) {
      let params = assign(
        {
          _: moment(this.updatedAt).valueOf(),
          // eslint-disable-next-line camelcase
          invoice_template: this.serialize()
        },
        options
      );

      return PromiseObject.create({
        promise: this.previewHtml(params)
      });
    },

    terms: service(),

    propertiesForDuplication() {
      let properties = {
        currency: this.currency,
        notes: this.notes,
        shipping: this.shipping,
        taxDistribution: this.taxDistribution,
        taxName: this.taxName,
        taxPercent: this.taxPercent,
        tax: this.tax,
        taxId: this.taxId,
        netTerms: this.netTerms,
        hasLateFee: this.hasLateFee,
        lateFeeKind: this.lateFeeKind,
        lateFeeInterval: this.lateFeeInterval,
        lateFee: this.lateFee
      };

      let dueOn;
      if (this.terms.isOtherTerm(this.netTerms)) {
        dueOn = moment(this.startDate).utc().add(this.netTermsDays, 'days');
      } else {
        dueOn = this.terms.findTermByType(this.netTerms).date;
      }

      return assign(properties, { dueOn });
    }
  }
);
