import Component from '@ember/component';
import DocumentShowComponent from 'frontend/mixins/components/document-show';
import { computed } from '@ember/object';
import { notEmpty, equal, filterBy, readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default Component.extend(DocumentShowComponent, {
  tagName: 'div',
  classNameBindings: ['isEstimate:estimate-view'],
  classNames: ['portal-document-view'],

  store: service(),

  paymentsLoaded: notEmpty('model.payments').readOnly(),
  isClosed: equal('model.statusSymbol', 'closed').readOnly(),

  approvedEvents: filterBy('events', 'kindKey', 'estimate_approved'),
  declinedEvents: filterBy('events', 'kindKey', 'estimate_declined'),

  estimateApprovedDate: readOnly('approvedEvents.firstObject.generatedAt'),
  estimateDeclinedDate: readOnly('declinedEvents.firstObject.generatedAt'),

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

  onMouseOver(event) {
    // eslint-disable-next-line ember/no-get
    event.srcElement.style.backgroundColor = this.get(
      'model.organization.buttonHoverColor'
    );
  },

  onMouseOut(event) {
    // eslint-disable-next-line ember/no-get
    event.srcElement.style.backgroundColor = this.get(
      'model.organization.buttonColor'
    );
  },

  actions: {
    scrollToPayView(value) {
      this.set('selectedPayment', value);
      later(() => {
        document
          .getElementById('top-payment-select')
          .scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
});
