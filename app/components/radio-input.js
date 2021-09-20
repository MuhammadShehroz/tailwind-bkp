import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['radio-field'],

  attributeBindings: [
    'checked',
    'disabled',
    'name',
    'required',
    'type',
    'value'
  ],

  checked: computed('radioValue', 'value', function () {
    return this.radioValue === this.value;
  }).readOnly(),

  change() {
    this.set('value', this.radioValue);

    if (this.onChange) {
      this.onChange();
    }
  }
});
