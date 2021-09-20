/* eslint-disable camelcase */
import Service from '@ember/service';
import EmberObject, { computed } from '@ember/object';

let DISTRIBUTION_OPTIONS = window.BSN.document.discountDistribution;
let DISTRIBUTION_LABELS = {
  no_discount: 'None',
  discount_for_entire_document: 'For entire invoice',
  discount_per_line_item: 'Per line item'
};

export default Service.extend({
  options: computed(function () {
    let options = [];

    DISTRIBUTION_OPTIONS.forEach((option) => {
      options.push(
        EmberObject.create({
          label: DISTRIBUTION_LABELS[option],
          value: option
        })
      );
    });

    return options;
  }),

  hasNoDiscount: (value) => {
    return value === null || value === 'no_discount';
  },

  documentDiscount: (value) => {
    return value === 'discount_for_entire_document';
  },

  lineItemDiscount: (value) => {
    return value === 'discount_per_line_item';
  },

  fixedDiscount: (value) => {
    return value === 'fixed_discount';
  }
});
