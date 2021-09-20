import Component from '@ember/component';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { and, equal, notEmpty } from '@ember/object/computed';

export default Component.extend({
  type: 'text',
  tagName: '',
  leadingIcon: '',
  allowClear: false,
  _isBlur: false,
  showClear: and('allowClear', 'hasContent'),
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _classNames: ['tw-input'],
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _classNameBindings: [
    'isNumber:tw-number-input',
    'showErrors:error',
    'hasLeadingIcon:with-leading-icon'
  ],

  _showErrors: and('showErrors', '_isBlur'),

  isNumber: equal('type', 'number'),
  hasLeadingIcon: notEmpty('leadingIcon').readOnly(),
  hasContent: computed('value', function () {
    return isPresent(this.value);
  }).readOnly(),

  fieldId: computed(function () {
    return guidFor(this);
  }),

  transform() {
    return (value) => (this.type === 'number' ? Number(value) : value);
  },

  value: computed('internalValue', 'type', {
    get() {
      let transform = this.transform();
      return transform(this.internalValue);
    },

    set(key, value) {
      let transform = this.transform();
      this.set('internalValue', transform(value));
      return value;
    }
  }),

  actions: {
    onTrailingIconClick() {
      if (this.onTrailingIconClick) {
        this.onTrailingIconClick(this);
      } else {
        this.set('value', '');
      }
    }
  }
});
