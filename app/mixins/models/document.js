import Mixin from '@ember/object/mixin';
import DependentRelationships from 'frontend/mixins/models/dependent-relationships';
import EmberObject, { computed } from '@ember/object';
import Tax from 'frontend/mixins/models/calculated-tax';
import { TAX_DISTRIBUTIONS } from 'frontend/services/tax-distribution';
import { belongsTo, attr } from '@ember-data/model';
import { equal, reads, gt, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isBlank } from '@ember/utils';
import { collectionAction } from 'frontend/lib/restless-methods';
import { guidFor } from '@ember/object/internals';
import { assign } from '@ember/polyfills';

const TaxGrouping = EmberObject.extend({
  label: computed('name', function () {
    let { name } = this;
    return isBlank(name) ? 'No Tax' : name;
  }),

  isBlank: equal('percent', 0)
});

const DiscountGrouping = EmberObject.extend({
  lineItem: true,
  isBlank: equal('total', 0),
  isFixedDiscount: equal('discountType', 'fixed_discount')
});

export default Mixin.create(DependentRelationships, Tax, {
  terms: service(),
  organizationService: service('organization'),
  ajax: service(),
  taxDistributionService: service('tax-distribution'),

  paymentTerms: reads('terms.paymentTerms'),
  currentOrganization: reads('organizationService.current'),

  shipping: attr('number', { defaultValue: 0 }),
  currency: attr(),
  notes: attr(),
  cachedTotal: attr('number'),

  taxDistribution: attr({ allowNull: true }),
  isTaxDistributionDocument: equal(
    'taxDistribution',
    TAX_DISTRIBUTIONS.TAX_FOR_ENTIRE_DOCUMENT
  ),

  isTaxDistributionLineItem: equal(
    'taxDistribution',
    TAX_DISTRIBUTIONS.TAX_PER_LINE_ITEM
  ),

  discountValue: attr('number'),
  discountDistribution: attr({ allowNull: true }),
  discountType: attr({ allowNull: true }),

  isInvoice: false,
  isEstimate: false,
  isInvoiceTemplate: false,

  organization: belongsTo(),

  modelName: reads('constructor.modelName'),

  netTermsLabel: computed('netTerms', 'paymentTerms', function () {
    let paymentTerm = this.terms.findTermByType(this.netTerms);

    if (paymentTerm) return paymentTerm.netLabel;
    return undefined;
  }),

  taxAttributes: computed(
    'isTaxDistributionLineItem',
    'tax',
    'taxName',
    'taxPercent',
    function () {
      if (this.isTaxDistributionLineItem) {
        return {
          tax: this.tax,
          taxId: this.tax.get('id'),
          taxName: this.taxName,
          taxPercent: this.taxPercent
        };
      }

      return {};
    }
  ),

  addLineItem() {
    this.unitOfMeasurement.then((unitOfMeasurement) => {
      let { lineItems } = this;

      let newLineItem = this.store.createRecord(
        `${this.modelName}-line-item`,
        assign(
          {
            position: lineItems.get('length'),
            unitOfMeasurement,
            price: this.unitPrice
          },
          this.taxAttributes
        )
      );

      lineItems.pushObject(newLineItem);
    });

    return this;
  },

  removeLineItem(lineItem) {
    this.lineItems.removeObject(lineItem);
    lineItem.unloadRecord();
  },

  subtotal: computed('lineItems.@each.total', function () {
    return this.lineItems.reduce(
      (sum, lineItem) => sum + lineItem.taxableTotal,
      0
    );
  }),

  total: computed(
    'subtotal',
    'shipping',
    'totalTaxAmount',
    'discount',
    function () {
      let subtotalAndTax = this.subtotal + this.totalTaxAmount - this.discount;

      if (this.shipping) {
        return subtotalAndTax + this.shipping;
      }

      return subtotalAndTax;
    }
  ),

  taxGroupings: computed(
    'lineItems.@each.{taxPercent,quantity,price,taxAmount}',
    function () {
      let taxGroups = this.lineItems.reduce((groups, item) => {
        let percent = item.taxPercent || 0;

        groups[percent] = groups[percent] || [];
        groups[percent].push(item);

        return groups;
      }, {});

      return Object.keys(taxGroups).map((percent) => {
        let items = taxGroups[percent];

        return {
          amount: items.reduce((sum, item) => sum + item.taxAmount, 0),
          count: items.length,
          name: items.firstObject.taxName,
          percent: Number(percent)
        };
      });
    }
  ),

  taxes: computed('taxGroupings.each', function () {
    return this.taxGroupings
      .map((tg) => TaxGrouping.create(tg))
      .rejectBy('isBlank');
  }),

  totalTaxAmount: computed(
    'calculatedTax.{name,percent}',
    'hasDocumentTax',
    'lineItems',
    'subtotal',
    'taxFraction',
    'taxGroupings',
    function () {
      let result = null;

      if (this.hasDocumentTax) {
        result = this.subtotal * this.taxFraction;
      } else {
        result = this.lineItems.reduce(
          (sum, lineItem) => sum + lineItem.taxAmount,
          0
        );
      }

      return result;
    }
  ),

  isAnyLineItemWithTaxPresent: computed('lineItems.@each.tax', function () {
    return this.lineItems.any((lineItem) => {
      if (lineItem.get('tax.id')) {
        return true;
      }
    });
  }),

  updateLineItemsOnTaxDistributionChange() {
    if (this.isTaxDistributionLineItem) {
      this.lineItems.forEach((lineItem) => {
        lineItem.set('calculatedTax', this.tax);
      });
    } else {
      this.resetEveryLineItemTax();
    }
  },

  resetEveryLineItemTax() {
    this.lineItems.forEach((lineItem) => {
      lineItem.set('calculatedTax', null);
    });
  },

  setNoneTaxScope() {
    this.set('taxDistribution', null);
  },

  setDocumentTaxDistribution() {
    this.set('taxDistribution', TAX_DISTRIBUTIONS.TAX_FOR_ENTIRE_DOCUMENT);
  },

  setLineItemTaxDistribution() {
    this.set('taxDistribution', TAX_DISTRIBUTIONS.TAX_PER_LINE_ITEM);
  },

  discountService: service('discount'),
  currencies: service(),
  currencySymbol: computed('currency', function () {
    return this.currencies.symbol(this.currency);
  }).readOnly(),

  hasDiscount: not('noDiscount'),
  noDiscount: computed('discountDistribution', function () {
    return this.discountService.hasNoDiscount(this.discountDistribution);
  }),

  subtotalAndTax: computed('subtotal', 'totalTaxAmount', function () {
    return this.subtotal + this.totalTaxAmount;
  }),

  discountOnDocument: computed('discountDistribution', function () {
    return this.discountService.documentDiscount(this.discountDistribution);
  }),

  documentDiscount: computed(
    'discountValue',
    'discountDistribution',
    'subtotalAndTax',
    'discountType',
    function () {
      if (this.discountService.fixedDiscount(this.discountType)) {
        return this.discountValue;
      }

      return (this.subtotalAndTax * this.discountValue) / 100;
    }
  ),

  discount: computed(
    'discountDistribution',
    'discountOnDocument',
    'discountType',
    'discountValue',
    'documentDiscount',
    'lineItemsDiscount',
    'noDiscount',
    function () {
      if (this.noDiscount) {
        return 0;
      }

      if (this.discountOnDocument) {
        return this.documentDiscount;
      }

      return this.lineItemsDiscount;
    }
  ),

  /* eslint-disable ember/require-computed-property-dependencies */
  discountGrouping: computed(
    'discountDistribution',
    'discountOnDocument',
    'discountType',
    'discountValue',
    'lineItems.@each.{discountType,discountValue}',
    'noDiscount',
    function () {
      if (this.noDiscount) return [];

      if (this.discountOnDocument) {
        return [
          {
            lineItem: false,
            discountType: this.discountType,
            discountValue: this.discountValue,
            total: this.discount
          }
        ];
      }

      let discountGroups = this.lineItems.reduce((groups, item) => {
        let { discountType, discountValue } = item;

        if (discountType && discountValue) {
          let key = `${discountType}-${discountValue}`;

          groups[key] = groups[key] || [];
          groups[key].push(item);
        }

        return groups;
      }, {});

      return Object.keys(discountGroups).map((key) => {
        let items = discountGroups[key];
        let item = items.firstObject;

        return {
          discountValue: item.discountValue,
          discountType: item.discountType,
          total: items.reduce((sum, item) => sum + item.discount, 0)
        };
      });
    }
  ),
  /* eslint-enable ember/require-computed-property-dependencies */

  discounts: computed('discountGrouping.[]', function () {
    let discountGrouping = this.discountGrouping.map((dg) =>
      DiscountGrouping.create(dg)
    );

    return discountGrouping.rejectBy('isBlank');
  }),

  multipleDiscounts: gt('discounts.length', 1),

  lineItemsDiscount: computed('discounts', function () {
    return this.discounts.reduce((sum, discount) => sum + discount.total, 0);
  }),

  modelLabel: reads('modelName'),

  newDefaults: collectionAction('new', { method: 'get' }),

  buildNew() {
    return this.newWithDefaults().then((data) => {
      let newAttrs = this.store.normalize(
        this.constructor.modelName,
        data[this.constructor.modelName]
      ).data.attributes;

      this.setProperties(newAttrs);

      return this;
    });
  },

  domId: computed('constructor.modelName', 'id', function () {
    let id = this.id || guidFor(this);

    return `${this.constructor.modelName}-${id}`;
  }),

  buildDelivery(options) {
    return this.store
      .createRecord(
        'delivery',
        assign(
          {
            deliverableId: this.id,
            deliverableType: this.modelName
          },
          options
        )
      )
      .buildNew();
  },

  syncTaxes() {
    if (this.isTaxDistributionDocument) {
      let { taxName } = this;
      let { taxPercent } = this;

      this.tax.then((tax) => {
        let outOfSyncTax =
          tax === null || taxName !== tax.name || tax.percent !== taxPercent;

        if (outOfSyncTax) {
          this.set('calculatedTax', tax);
        }
      });
    } else {
      this.lineItems.forEach((lineItem) => {
        let { taxName } = lineItem;
        let { taxPercent } = lineItem;

        lineItem.tax.then((tax) => {
          let outOfSyncTax =
            tax === null || taxName !== tax.name || tax.percent !== taxPercent;

          if (outOfSyncTax) {
            lineItem.set('calculatedTax', tax);
          }
        });
      });
    }
  }
});
