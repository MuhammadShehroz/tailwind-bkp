import Mixin from '@ember/object/mixin';
import { belongsTo, attr } from '@ember-data/model';
import { notEmpty, and } from '@ember/object/computed';

export default Mixin.create({
  currency: attr(),
  includeAch: attr('boolean', { allowNull: true }),
  includeStripe: attr('boolean', { allowNull: true }),
  includePaypal: attr('boolean', { allowNull: true }),
  includeCoinbase: attr('boolean', { allowNull: true }),
  netTerms: attr(),
  pdfAttached: attr('boolean', { allowNull: true }),
  shipping: attr('number'),
  tax: belongsTo('tax'),
  taxDistribution: attr({ allowNull: true }),
  unitOfMeasurement: belongsTo({ inverse: null }),
  unitPrice: attr('number'),
  hasLateFee: attr('boolean', { default: false }),
  lateFeeKind: attr({ allowNull: true }),
  lateFeeInterval: attr({ allowNull: true }),
  lateFee: attr('number'),

  presentTax: notEmpty('tax.id'),
  hasTax: and('presentTax', 'tax.active')
});
