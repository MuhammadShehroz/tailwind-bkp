import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  openInvoices: attr('number'),
  draftInvoices: attr('number'),
  closedInvoices: attr('number'),
  openEstimates: attr('number'),
  draftEstimates: attr('number'),
  approvedEstimates: attr('number'),
  declinedEstimates: attr('number'),
  recurringInvoices: attr('number'),

  openDocuments: computed('openInvoices', 'openEstimates', function () {
    return this.openInvoices + this.openEstimates;
  }),

  draftDocuments: computed('draftInvoices', 'draftEstimates', function () {
    return this.draftInvoices + this.draftEstimates;
  })
});
