import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  invoiceRoute: computed('content.documentId', function () {
    return `/invoices/${this.content.documentId}`;
  })
});
