import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Mixin.create({
  currencies: service(),
  currencySymbol: computed('currency', 'currencies.all', function () {
    return this.currencies.symbol(this.currency);
  }).readOnly(),

  lateFeeService: service('late-fee'),
  lateFeeLabel: computed(
    'hasLateFee',
    'lateFeeKind',
    'lateFeeInterval',
    'lateFee',
    'currencySymbol',
    function () {
      if (!this.hasLateFee) {
        return;
      }

      let interval = this.lateFeeService.intervalFind(this).label;
      if (this.lateFeeKind === 'percent') {
        return `${this.lateFee}% ${interval}`;
      }

      let currencySymbol = this.currencySymbol || '';
      return `${currencySymbol}${this.lateFee} ${interval}`;
    }
  )
});
