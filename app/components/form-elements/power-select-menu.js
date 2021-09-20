import Component from '@ember/component';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  placeholder: htmlSafe('&nbsp;'),
  searchPlaceholder: 'Search ...',
  showErrors: false,
  searchEnabled: false,
  errorMessage: '',
  noMatchesMessage: 'No items found!',

  highlightItem() {
    return null;
  },

  onChange(value) {
    this.set('value', value);
  },

  actions: {
    onChange(value) {
      this.onChange(value);
    }
  }
});
