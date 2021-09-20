import Component from '@ember/component';
import { computed } from '@ember/object';
import { or, bool, alias, reads } from '@ember/object/computed';
import DocumentFormComponent from 'frontend/mixins/components/document-form';

export default Component.extend(DocumentFormComponent, {
  elementId: 'invoice',

  validations: alias('model.validations.attrs'),
  showNotes: bool('model.notes').readOnly(),
  showInvoiceDetails: bool('hasInvoiceDetails').readOnly(),

  hasInvoiceDetails: or(
    'model.poNumber',
    'model.shipping',
    'model.lateFee',
    'model.isTaxDistributionLineItem',
    'model.isTaxDistributionDocument'
  ).readOnly(),

  netTerm: computed('model.{issuedOn,netTerms}', 'paymentTerms', function () {
    return this.paymentTerms.find((term) => term.value === this.model.netTerms);
  }),

  client: reads('model.client'),

  submit(event) {
    event.preventDefault();
    this.saveAndPreview();
  },

  actions: {
    save() {
      this.save();
    },

    setDueDate(option) {
      this.set('model.dueOn', option.date);
    },

    move() {
      let item = this.sortedLineItems.objectAt(this.from);
      this.sortedLineItems.removeObject(item);
      this.sortedLineItems.insertAt(this.to, item);
      this.reorderLineItems(this.sortedLineItems);
    },

    fromPosition(from) {
      this.set('from', from);
    },

    toPosition(to) {
      this.set('to', to);
    },

    onCurrencyChange(currency) {
      this.set('model.currency', currency.code);
    },

    onClientChange(client) {
      this.set('model.client', client);
      this.set('client', client);
      this.send('changeDefaultsClientBased', client);
    },

    onInvoiceDateChange(date) {
      this.terms.set('startDate', date);
    }
  }
});
