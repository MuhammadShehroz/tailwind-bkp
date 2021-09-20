import Model, { attr } from '@ember-data/model';
import LineItemCore from 'frontend/mixins/models/line-item-core';

export default Model.extend(LineItemCore, {
  currency: attr(),
  taxDistribution: attr({ allowNull: true }),

  convertToLineItem(document, position) {
    return this.store.createRecord(`${document.get('modelName')}-line-item`, {
      position,
      quantity: this.quantity,
      unitOfMeasurement: this.unitOfMeasurement,
      name: this.name,
      price: this.price,
      tax: this.tax,
      taxName: this.taxName,
      taxPercent: this.taxPercent,
      savedItem: this
    });
  }
});
