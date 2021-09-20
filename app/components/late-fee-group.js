import Component from '@ember/component';
import FeeOption from 'frontend/utils/fee-option';
import { inject as service } from '@ember/service';
import { readOnly, alias } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  classNames: ['late-fee-group', 'field'],
  label: 'Late Fee (optional)',

  lateFeeService: service('late-fee'),
  lateFeeOptions: alias('lateFeeService.lateFeeOptions'),
  intervalOptions: readOnly('lateFeeService.lateFeeIntervals'),

  lateFeeCustomOption: computed(
    'model.{lateFeeKind,lateFeeInterval,lateFee}',
    'currencySymbol',
    function () {
      let { model } = this;
      let interval = this.lateFeeService.intervalFind(this.model).label;

      if (this.model.lateFeeKind === 'percent') {
        return FeeOption.create({
          label: `${model.lateFee}% ${interval}`,
          lateFeeKind: model.lateFeeKind,
          lateFeeInterval: model.lateFeeInterval,
          lateFee: model.lateFee,
          hasLateFee: true,
          otherPercentage: true
        });
      }

      let currencySymbol = this.currencySymbol || '';
      return FeeOption.create({
        label: `${currencySymbol}${model.lateFee} ${interval}`,
        lateFeeKind: model.lateFeeKind,
        lateFeeInterval: model.lateFeeInterval,
        lateFee: model.lateFee,
        hasLateFee: true,
        otherPercentage: true
      });
    }
  ),

  lateFee: computed(
    'lateFeeCustomOption',
    'lateFeeOptions',
    'model.{hasLateFee,lateFee,lateFeeInterval,lateFeeKind}',
    {
      get() {
        if (this.model.hasLateFee) {
          let lateFee = this.lateFeeService.lateFeeFind(this.model);
          if (lateFee) {
            return lateFee;
          }

          return this.lateFeeCustomOption;
        }

        return 0;
      },

      set(key, value) {
        if (value.hasLateFee) {
          this.model.setProperties({
            hasLateFee: true,
            lateFeeKind: value.lateFeeKind,
            lateFeeInterval: value.lateFeeInterval,
            lateFee: value.lateFee
          });

          if (this.change) {
            this.change();
          }

          return value;
        } else {
          this.model.setProperties({
            hasLateFee: false,
            lateFeeKind: null,
            lateFeeInterval: null,
            lateFee: 0
          });

          return;
        }
      }
    }
  ),

  lateFeeInterval: computed(
    'intervalOptions',
    'model.{hasLateFee,lateFeeInterval}',
    {
      get() {
        if (this.model.hasLateFee) {
          return this.lateFeeService.intervalFind(this.model);
        }

        return undefined;
      },

      set(key, value) {
        if (value.lateFeeInterval) {
          this.model.set('lateFeeInterval', value.lateFeeInterval);

          return value;
        } else {
          this.model.setProperties({
            hasLateFee: false,
            lateFee: 0
          });
        }

        return;
      }
    }
  ),

  actions: {
    setLateFee(option) {
      this.set('lateFee', option);
    }
  }
});
