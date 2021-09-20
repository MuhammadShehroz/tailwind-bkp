import Mixin from '@ember/object/mixin';
import VirtualTax from 'frontend/models/virtual-tax';
import { belongsTo, attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { notEmpty, and } from '@ember/object/computed';

const StaticVirtualTax = VirtualTax.extend({
  id: null,
  name: null,
  percent: null
});

export default Mixin.create({
  tax: belongsTo(),
  taxId: attr(),
  taxName: attr(),
  taxPercent: attr('number'),
  hasTax: notEmpty('taxPercent'),

  virtualTax: null,

  taxFraction: computed('calculatedTax.percent', function () {
    return (this.calculatedTax?.percent || 0) / 100.0;
  }),

  isTaxDesynchronized: computed(
    'calculatedTax.{name,percent}',
    'tax.{name,percent}',
    function () {
      let result = false;

      // eslint-disable-next-line ember/no-get
      if (this.get('tax.name') && this.get('tax.percent')) {
        if (this.calculatedTax) {
          if (
            // eslint-disable-next-line ember/no-get
            this.calculatedTax.name !== this.get('tax.name') ||
            // eslint-disable-next-line ember/no-get
            this.calculatedTax.percent !== this.get('tax.percent')
          ) {
            result = true;
          }
        }
      }

      return result;
    }
  ),

  hasDocumentTax: and('calculatedTax', 'isTaxDistributionDocument'),

  calculatedTax: computed('taxId', 'taxName', 'taxPercent', 'virtualTax', {
    get() {
      if (this.taxName && this.taxPercent) {
        this.virtualTax.setProperties({
          id: this.taxId || null,
          name: this.taxName,
          percent: this.taxPercent
        });

        return this.virtualTax;
      }

      return undefined;
    },

    set(key, value) {
      let tax = null;
      if (value) {
        if (value.get('entity')) {
          tax = value.get('entity');
        } else {
          tax = value;
        }
      }

      this.set('tax', tax);

      if (value) {
        this.set('taxName', value.get('name'));
        this.set('taxPercent', value.get('percent'));

        this.virtualTax.setProperties({
          id: value.get('id') || null,
          name: value.get('name'),
          percent: value.get('percent'),
          entity: value.get('entity') || null
        });

        return this.virtualTax;
      }

      this.set('taxName', null);
      this.set('taxPercent', null);
      return null;
    }
  }),

  init() {
    this._super();
    let virtualTax = StaticVirtualTax.create({
      entity: null,
      id: null,
      name: null,
      percent: null
    });
    this.set('virtualTax', virtualTax);
  }
});
