import Controller from '@ember/controller';
import DocumentController from 'frontend/mixins/controllers/portal/document';
import DocumentShowComponent from 'frontend/mixins/components/document-show';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import ENV from 'frontend/config/environment';

export default Controller.extend(DocumentController, DocumentShowComponent, {
  isCommentFormExpanded: false,
  payable: readOnly('model.payable'),
  scriptUrl: computed('model.currency', function () {
    return `https://www.paypal.com/sdk/js?client-id=${ENV.paypal.clientId}&currency=${this.model.currency}`;
  }),

  actions: {
    showPanel() {
      this.set('showClientPayment', true);
    },

    newComment() {
      return this.newComment();
    },

    hideActions() {
      this.set('showClientPayment', false);
    },

    payInvoice() {
      this.set('showClientPayment', false);
    },

    startProcessing(message) {
      this.send('startLoading', message);
    },

    processingFinished() {
      this.send('endLoading');
    },

    scrollToPayments() {
      let paymentSelectElement = document.querySelector('.pay-view');
      paymentSelectElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }
});
