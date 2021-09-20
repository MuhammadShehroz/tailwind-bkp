import Model, { attr } from '@ember-data/model';

export default Model.extend({
  amountOff: attr('number'),
  percentOff: attr('number'),
  valid: attr('boolean'),

  discountedPrice(price) {
    if (this.valid === false) return price;

    let discountedPrice = price;
    let { amountOff } = this;

    if (amountOff) {
      discountedPrice = price - amountOff;
    }

    let { percentOff } = this;
    if (this.percentOff) {
      discountedPrice = price - (price * percentOff) / 100;
    }

    return discountedPrice.toFixed(2);
  }
});
