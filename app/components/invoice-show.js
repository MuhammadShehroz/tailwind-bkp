import Component from '@ember/component';
import DocumentShowComponent from 'frontend/mixins/components/document-show';
import { computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend(DocumentShowComponent, {
  store: service(),
  paymentsLoaded: notEmpty('model.payments'),
  modals: service(),
  showClientPayment: false,

  payments: computed(
    'model.{id,payments.@each.isNew}',
    'paymentsLoaded',
    function () {
      if (this.paymentsLoaded) {
        return this.model.payments.rejectBy('isNew').sortBy('date');
      }

      return this.store.query('payment', { invoice_id: this.model.id }); // eslint-disable-line camelcase
    }
  ),

  actions: {
    removePayment(payment) {
      this.removePayment(payment);
    },

    showPanel() {
      this.set('showClientPayment', true);
    },

    hideActions() {
      this.set('showClientPayment', false);
    },

    payInvoice() {
      this.set('showClientPayment', false);
    }
  }
});
