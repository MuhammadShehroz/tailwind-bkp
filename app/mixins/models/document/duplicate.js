import Mixin from '@ember/object/mixin';
import { assign } from '@ember/polyfills';

export default Mixin.create({
  propertiesForDuplication() {
    let result = {
      client: this.client,
      currency: this.currency,
      notes: this.notes,
      poNumber: this.poNumber,
      shipping: this.shipping,
      taxDistribution: this.taxDistribution,
      taxName: this.taxName,
      taxPercent: this.taxPercent,
      tax: this.tax,
      taxId: this.taxId
    };

    if (this.hasLateFee) {
      result = assign(result, this.lateFeePropertiesForDuplication());
    }

    return result;
  },

  lateFeePropertiesForDuplication() {
    return {
      hasLateFee: this.hasLateFee,
      lateFee: this.lateFee,
      lateFeeKind: this.lateFeeKind,
      lateFeeInterval: this.lateFeeInterval
    };
  },

  duplicate(document) {
    return this.buildNew().then((newDocument) => {
      let lineItems = newDocument.get('lineItems');

      let properties = assign(
        { duplication: true },
        document.propertiesForDuplication()
      );
      newDocument.setProperties(properties);
      if (document.get('modelName') !== newDocument.get('modelName')) {
        newDocument.set('convertedFrom', document);
      }

      document.get('lineItems').forEach((documentItem) => {
        let lineItem = this.store.createRecord(
          `${this.modelName}-line-item`,
          documentItem.propertiesForDuplication()
        );
        lineItems.addObject(lineItem);
      });

      return newDocument;
    });
  }
});
