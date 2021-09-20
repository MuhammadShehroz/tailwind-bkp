import Component from '@ember/component';
import { assign } from '@ember/polyfills';
import { or, bool, alias, reads } from '@ember/object/computed';
import DocumentFormComponent from 'frontend/mixins/components/document-form';

export default Component.extend(DocumentFormComponent, {
  elementId: 'estimate',
  validations: alias('model.validations.attrs'),

  _params(options = {}) {
    return assign(options, {
      archived: false,
      page: { number: 1, size: 10 },
      sort: 'name',
      order: 'asc'
    });
  },

  client: reads('model.client'),

  hasEstimateDetails: or(
    'model.shipping',
    'model.isTaxDistributionLineItem',
    'model.isTaxDistributionDocument'
  ).readOnly(),

  showNotes: bool('model.notes').readOnly(),
  showEstimateDetails: bool('hasEstimateDetails').readOnly(),

  submit(event) {
    event.preventDefault();
    this.saveAndPreview();
  },

  actions: {
    save() {
      this.save();
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
      this.send('changeDefaultsClientBased', client);
      this.set('model.client', client);
      this.set('client', client);
    }
  }
});
