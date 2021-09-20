import Component from '@ember/component';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { and, equal, notEmpty } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  type: 'text',
  showClear: and('allowClear', 'hasContent'),
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _classNames: ['tw-input'],
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _classNameBindings: [
    'isNumber:tw-number-input',
    'showErrors:error',
    'hasLeadingIcon:with-leading-icon',
    'hasTrailingButton:with-trailing-button'
  ],

  isNumber: equal('type', 'number'),
  hasLeadingIcon: notEmpty('leadingIcon').readOnly(),
  hasTrailingButton: notEmpty('trailingButton').readOnly(),
  hasContent: computed('value', function () {
    return isPresent(this.value);
  }).readOnly(),

  fieldId: computed(function () {
    return guidFor(this);
  }),

  actions: {
    onButtonClick() {
      let handler = this.onButtonClick || function () {};
      return handler();
    },

    clear() {
      this.set('value', '');
    }
  }
});
