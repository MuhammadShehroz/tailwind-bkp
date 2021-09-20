import { A } from '@ember/array';
import { computed } from '@ember/object';
import PowerSelectMenu from 'frontend/components/form-elements/power-select-menu';

export default PowerSelectMenu.extend({
  onChange: (value) => (option) => value.pushObject(option),
  onRemove: (value) => (item) => value.removeObject(item),
  filter: (value) => (item) => value.includes(item),

  filteredOptions: computed('options.[]', 'value.[]', function () {
    let value = this.value || A();
    let options = this.options || A();
    return options.reject(this.filter(value));
  }),

  actions: {
    onChange(option) {
      this.onChange(this.value)(option);
    },

    removeItem(item) {
      this.onRemove(this.value)(item);
    }
  }
});
