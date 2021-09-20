import Document from 'frontend/mixins/models/document';
import DocumentStatus from 'frontend/mixins/models/document/status';
import DocumentIdentifier from 'frontend/mixins/models/document/identifier';
import DocumentClient from 'frontend/mixins/models/document/client';
import DocumentDuplicate from 'frontend/mixins/models/document/duplicate';
import DocumentPreview from 'frontend/mixins/models/document/preview';
import ConvertableDocument from './convertable-document';
import { attr, hasMany } from '@ember-data/model';
import { equal } from '@ember/object/computed';
import EstimateValidations from 'frontend/validations/estimate';

export default ConvertableDocument.extend(
  Document,
  EstimateValidations,
  DocumentStatus,
  DocumentIdentifier,
  DocumentClient,
  DocumentDuplicate,
  DocumentPreview,
  {
    issuedOn: attr('date'),
    lastSentAt: attr('date'),

    lineItems: hasMany('estimateLineItem', { async: false }),

    isApproved: equal('statusSymbol', 'approved'),
    isDeclined: equal('statusSymbol', 'declined'),
    isConverted: equal('statusSymbol', 'converted'),
    isEstimate: true,
    validationsEnabled: false,

    approve() {
      let adapter = this.store.adapterFor(this.modelName);
      return adapter.approve(this.id);
    },

    decline() {
      let adapter = this.store.adapterFor(this.modelName);
      return adapter.decline(this.id);
    }
  }
);
