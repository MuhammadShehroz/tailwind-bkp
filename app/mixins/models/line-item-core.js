import Mixin from '@ember/object/mixin';
import CalculatedTax from 'frontend/mixins/models/calculated-tax';
import { belongsTo, attr } from '@ember-data/model';
import { notEmpty } from '@ember/object/computed';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import LineItemValidations from 'frontend/validations/line-item';

export default Mixin.create(LineItemValidations, CalculatedTax, {
  name: attr({ defaultValue: '' }),
  price: attr('number', { defaultValue: 0 }),
  quantity: attr('number', { defaultValue: 1 }),
  unitOfMeasurement: belongsTo(),

  hasName: notEmpty('name'),

  total: computed('taxableTotal', 'taxAmount', function () {
    return this.taxableTotal + this.taxAmount;
  }),

  taxAmount: computed('taxableTotal', 'taxFraction', function () {
    return this.taxableTotal * this.taxFraction;
  }),

  taxableTotal: computed('price', 'quantity', function () {
    let result = 0;

    if (this.price && this.quantity) {
      result = this.price * this.quantity;
    }

    return result;
  }),

  priceWithTax: computed('price', 'taxFraction', function () {
    return this.price + this.price * this.taxFraction;
  }),

  domId: computed('constructor.modelName', 'id', function () {
    let id = this.id || guidFor(this);

    return `${this.constructor.modelName}-${id}`;
  })
});
