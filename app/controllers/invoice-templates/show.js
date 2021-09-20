import Controller from '@ember/controller';
import DocumentsShowController from 'frontend/mixins/controllers/documents/show';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend(DocumentsShowController, {
  terms: service(),
  netTerms: computed('model.netTerms', function () {
    let { netTerms } = this.model;
    return this.terms.findRecurringTermByType(netTerms).dropdownLabel;
  }),

  actions: {
    convertToInvoice() {
      let queryParams = {
        source_type: 'invoice-template', // eslint-disable-line camelcase
        source_id: this.model.id // eslint-disable-line camelcase
      };
      this.transitionToRoute('invoices.new', { queryParams });
    }
  }
});
