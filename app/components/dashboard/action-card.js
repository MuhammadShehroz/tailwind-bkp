import Component from '@ember/component';
import { equal, and } from '@ember/object/computed';

export default Component.extend({
  isInvoiceCard: equal('card.cardName', 'invoices').readOnly(),
  showFlag: and('isInvoiceCard', 'newUser').readOnly(),
  isLeft: equal('index', '').readOnly()
});
