import Component from '@ember/component';
import { TAX_DISTRIBUTIONS } from 'frontend/services/tax-distribution';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  modals: service(),
  taxDistribution: service(),

  taxDistributionOptions: computed(
    'taxDistribution.options',
    'model.taxDistribution',
    function () {
      let options = [...this.taxDistribution.options];
      if (this.model.taxDistribution === null) {
        let noneOption = options.findBy('value', TAX_DISTRIBUTIONS.NO_TAX);
        options.removeObject(noneOption);
      }

      return options;
    }
  ),

  currentTaxDistribution: computed(
    'taxDistributionOptions',
    'model.taxDistribution',
    {
      get() {
        if (this.model.taxDistribution) {
          return this.taxDistributionOptions.findBy(
            'value',
            this.model.taxDistribution
          );
        }

        return undefined;
      },

      set(key, value) {
        let result = null;

        if (this.beforeChange) {
          this.beforeChange(value);
        }

        if (
          this.model.taxDistribution &&
          this.model.taxDistribution !== value
        ) {
          if (
            this.model.taxDistribution ===
            TAX_DISTRIBUTIONS.TAX_FOR_ENTIRE_DOCUMENT
          ) {
            this.onStoredLineItemTaxesChange();
          }

          if (
            this.model.taxDistribution === TAX_DISTRIBUTIONS.TAX_PER_LINE_ITEM
          ) {
            this.onStoredTaxChange();
          }
        }

        if (value.value === TAX_DISTRIBUTIONS.NO_TAX) {
          this.model.set('taxDistribution', result);
        } else {
          result = value;
          this.model.set('taxDistribution', result.value);
        }

        this.model.updateLineItemsOnTaxDistributionChange();
        return result;
      }
    }
  ),

  allowVisibleDropdownAndUpdateTaxes() {
    let document = this.document || this.model;
    document.syncTaxes();
  },

  actions: {
    change(select) {
      if (this.onChange) {
        this.onChange(select);
      }
    },

    openTaxManager() {
      this.modals.open('tax-manager', {
        controller: 'modals.tax-manager',
        createTax: this.createTax,
        afterSaveCallback: () => this.allowVisibleDropdownAndUpdateTaxes()
      });
    }
  }
});
