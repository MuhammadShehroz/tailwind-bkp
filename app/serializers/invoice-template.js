import DocumentSerializer from 'frontend/serializers/document';
import { setProperties } from '@ember/object';
import { isBlank } from '@ember/utils';

export default DocumentSerializer.extend({
  attrs: {
    lineItems: { embedded: 'always' },
    recurringSchedules: { serialize: 'records', deserialize: false }
  },

  normalize(invoiceTemplate, hash) {
    let [hour, minuteAndmeridian] = hash.send_invoices_at.split(':');
    let [minute, meridian] = minuteAndmeridian.split(' ');
    setProperties(hash, { hour, minute, meridian });

    if (isBlank(hash.template_name)) {
      delete hash.template_name;
    }

    if (isBlank(hash.frequency_type)) {
      delete hash.frequency_type;
    }

    return this._super(invoiceTemplate, hash);
  }
});
