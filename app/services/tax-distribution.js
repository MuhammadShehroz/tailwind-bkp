import Service from '@ember/service';
import EmberObject, { computed } from '@ember/object';

const OPTIONS = window.BSN.document.taxDistributions;

export const TAX_DISTRIBUTIONS = {
  NO_TAX: 'no_tax',
  TAX_FOR_ENTIRE_DOCUMENT: 'tax_for_entire_document',
  TAX_PER_LINE_ITEM: 'tax_per_line_item'
};

const LABELS = {
  [TAX_DISTRIBUTIONS.NO_TAX]: 'None',
  [TAX_DISTRIBUTIONS.TAX_FOR_ENTIRE_DOCUMENT]: 'For entire invoice',
  [TAX_DISTRIBUTIONS.TAX_PER_LINE_ITEM]: 'Per line item'
};

export default Service.extend({
  options: computed(function () {
    let options = [];

    OPTIONS.forEach((option) => {
      options.push(
        EmberObject.create({
          label: LABELS[option],
          value: option
        })
      );
    });

    return options;
  })
});
