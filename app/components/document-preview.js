import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  isLoaded: false,

  previewDoc: computed(
    'includeAch',
    'includePaypal',
    'includeStripe',
    'message',
    'model.updatedAt',
    'pdfAttached',
    function () {
      return this.model.previewDoc({
        media: 'web',
        message: this.message,
        pdf_attached: this.pdfAttached, // eslint-disable-line camelcase
        include_ach: this.includeAch, // eslint-disable-line camelcase
        include_stripe: this.includeStripe, // eslint-disable-line camelcase
        include_paypal: this.includePaypal // eslint-disable-line camelcase
      });
    }
  ),

  actions: {
    previewLoaded(height) {
      this.set('isLoaded', true);
      this.element.style.height = `${height}px`;
      this.onLoadPreview?.(height);
    }
  }
});
