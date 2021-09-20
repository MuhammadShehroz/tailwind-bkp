import { A } from '@ember/array';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import { guidFor } from '@ember/object/internals';

export default Component.extend({
  showErrors: false,
  errorMessage: '',

  init() {
    this._super(...arguments);
    this.set('options', this.options || A());
  },

  fieldId: computed(function () {
    return guidFor(this);
  }),

  isSelected: notEmpty('value'),

  onChange() {},

  actions: {
    select(event) {
      let { value } = event.currentTarget;
      this.set('value', value);
      this.onChange(value);
    }
  }
});
