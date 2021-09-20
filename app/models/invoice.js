import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import Document from 'frontend/mixins/models/document';
import DocumentStatus from 'frontend/mixins/models/document/status';
import DocumentIdentifier from 'frontend/mixins/models/document/identifier';
import DocumentClient from 'frontend/mixins/models/document/client';
import DocumentDuplicate from 'frontend/mixins/models/document/duplicate';
import DocumentPreview from 'frontend/mixins/models/document/preview';
import LateFeeLabel from 'frontend/mixins/models/late-fee-label';
import moment from 'moment';
import { gt, reads, equal } from '@ember/object/computed';
import { assign } from '@ember/polyfills';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';
import InvoiceValidations from 'frontend/validations/invoice';

export default Model.extend(
  Document,
  InvoiceValidations,
  DocumentStatus,
  DocumentIdentifier,
  DocumentClient,
  DocumentDuplicate,
  DocumentPreview,
  LateFeeLabel,
  {
    cachedTotalPaid: attr('number'),
    cachedTotalDue: attr('number'),
    cachedTotalDueUnsettled: attr('number'),
    totalDueUnsettled: reads('cachedTotalDueUnsettled'),
    totalDue: reads('cachedTotalDue'),
    totalPaid: reads('cachedTotalPaid'),
    dueOn: attr('date'),
    netTerms: attr(),
    poNumber: attr(),
    fullNumber: attr(),
    convertedFrom: belongsTo('convertable-document', { polymorphic: true }),
    lineItems: hasMany('invoiceLineItem', { async: false }),
    payments: hasMany(),
    issuedOn: attr('date'),
    lastSentAt: attr('date'),
    hasPayments: attr('boolean'),

    isPastDue: equal('statusSymbol', 'past_due'),
    isClosed: equal('statusSymbol', 'closed'),

    hasPaid: gt('totalPaid', 0),

    hasLateFee: attr('boolean'),
    lateFeeKind: attr({ allowNull: true }),
    lateFeeInterval: attr({ allowNull: true }),
    lateFee: attr('number'),
    cachedLateFee: attr('number'),

    isInvoice: true,

    payable: attr('boolean'),
    stripePaymentEnabled: attr('boolean'),
    paypalPaymentEnabled: attr('boolean'),
    achPaymentEnabled: attr('boolean'),
    coinbasePaymentEnabled: attr('boolean'),
    merchantId: attr('string'),

    plaidLinkToken: attr({ allowNull: true }),
    coinbaseInvoiceGenerated: attr('boolean'),

    validationsEnabled: false,

    terms: service(),

    buildPayment(options) {
      let { currency, totalDueUnsettled } = this;

      return this.store.createRecord(
        'payment',
        assign(
          {
            amount: totalDueUnsettled,
            currency,
            invoice: this
          },
          options
        )
      );
    },

    // eslint-disable-next-line ember/no-observers
    prefixObserver: observer('prefix', 'number', function () {
      if (!this.isDeleted) {
        this.set('fullNumber', `${this.prefix}-${this.number}`);
      }
    }),

    daysPastDue: computed('dueOn', function () {
      let today = moment().utc().startOf('day');

      let dueOn = moment(this.dueOn).utc();

      return moment.duration(today.diff(dueOn)).asDays();
    }),

    propertiesForDuplication() {
      let { netTerms } = this;
      let dueOn = this.terms.calculateDueOn(
        netTerms,
        this.dueOn,
        this.issuedOn
      );

      return assign({ netTerms, dueOn }, this._super());
    },

    save() {
      let { _super } = this;

      return this.convertedFrom.then((convertedFrom) => {
        if (convertedFrom && convertedFrom.isEstimate) {
          return _super.call(this, {
            adapterOptions: {
              isConvertMode: true
            }
          });
        } else {
          return _super.call(this);
        }
      });
    }
  }
);
