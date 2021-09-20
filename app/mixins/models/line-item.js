import Mixin from '@ember/object/mixin';
import LineItemCore from 'frontend/mixins/models/line-item-core';
import { attr } from '@ember-data/model';
import { notEmpty } from '@ember/object/computed';
import { assign } from '@ember/polyfills';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Mixin.create(LineItemCore, {
  position: attr('number', { defaultValue: 0 }),
  savedItem: null,
  isLoaded: notEmpty('savedItem'),
  discountType: attr(),
  discountValue: attr('number'),

  defaultProperties() {
    return {
      name: this.name,
      price: this.price,
      quantity: this.quantity,
      tax: this.tax,
      taxId: this.taxId,
      taxName: this.taxName,
      taxPercent: this.taxPercent,
      unitOfMeasurement: this.unitOfMeasurement
    };
  },

  propertiesForDuplication() {
    return assign(this.defaultProperties(), { position: this.position });
  },

  saveToLibrary() {
    return this.document.then((document) => {
      let itemProperties = assign(this.defaultProperties(), {
        currency: document.currency,
        taxDistribution: document.get('taxDistribution')
      });

      return this.store.createRecord('saved-item', itemProperties).save();
    });
  },

  discountService: service('discount'),
  discount: computed('discountType', 'discountValue', 'total', function () {
    if (this.discountService.fixedDiscount(this.discountType)) {
      return this.discountValue;
    }

    return (this.total * this.discountValue) / 100.0;
  })
});
