import Component from '@ember/component';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default Component.extend({
  type: 'radio',
  tagName: '',
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _classNames: ['tw-radio'],
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _classNameBindings: ['showErrors:error'],
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _attributeBindings: ['checked'],

  fieldId: computed(function () {
    return guidFor(this);
  }),

  checked: computed('value', 'option', function () {
    return this.value === this.option;
  }),

  actions: {
    onSelect() {
      this.set('value', this.option);
    }
  }
});
