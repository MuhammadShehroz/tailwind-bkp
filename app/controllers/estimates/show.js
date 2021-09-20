import Controller from '@ember/controller';
import DocumentsShowController from 'frontend/mixins/controllers/documents/show';

const inlineActionsDisplay = {
  showSend: false
};

export default Controller.extend(
  DocumentsShowController,
  inlineActionsDisplay,
  {
    hideActions() {
      this.setProperties(inlineActionsDisplay);
    },

    actions: {
      newComment() {
        return this.newComment();
      },

      convertToInvoice() {
        let queryParams = {
          source_type: 'estimate', // eslint-disable-line camelcase
          source_id: this.model.id // eslint-disable-line camelcase
        };
        this.transitionToRoute('invoices.new', { queryParams });
      }
    }
  }
);
