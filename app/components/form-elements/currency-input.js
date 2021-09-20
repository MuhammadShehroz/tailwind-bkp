import { computed } from '@ember/object';
import TextInput from 'frontend/components/form-elements/text-input';

export default TextInput.extend({
  tagName: '',
  type: 'text',
  inactive: true,

  maskOptions: computed(
    'decimals',
    'decimalsSeparator',
    'thousandsSeparator',
    'inactive',
    function () {
      return {
        mask: Number,
        scale: this.decimals || 2,
        max: 1000000000000,
        radix: this.decimalsSeparator || '.',
        padFractionalZeros: this.inactive,
        thousandsSeparator: this.thousandsSeparator || ''
      };
    }
  ),

  actions: {
    focusIn() {
      this.set('_isBlur', this.showErrors);
      this.set('inactive', false);
    },

    focusOut() {
      this.set('_isBlur', true);
      this.set('inactive', true);
    }
  }
});
