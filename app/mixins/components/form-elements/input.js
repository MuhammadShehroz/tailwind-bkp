import Mixin from '@ember/object/mixin';
import { computed, defineProperty } from '@ember/object';
import { alias, and, notEmpty, readOnly } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { dasherize } from '@ember/string';
import { once } from '@ember/runloop';

export default Mixin.create({
  fieldId: computed('elementId', 'valuePath', function () {
    return `${this.elementId}-${dasherize(this.valuePath)}`;
  }),

  disabled: false,
  hasLabel: notEmpty('label').readOnly(),
  hasHint: notEmpty('hint').readOnly(),
  hasButtonAction: notEmpty('buttonAction').readOnly(),

  showPlaceholderOnBlank: false,
  hasPlaceholder: notEmpty('placeholder').readOnly(),
  showPlaceholder: and('showPlaceholderOnBlank', 'hasPlaceholder'),

  hasContent: computed('value', function () {
    return isPresent(this.value);
  }).readOnly(),

  showErrors: and('validationsEnabled', 'hasErrors'),

  hasErrors: and('validation', 'validation.isTruelyInvalid'),

  init() {
    this._super(...arguments);
    defineProperty(this, 'value', alias(`model.${this.valuePath}`));
    if (this.record) {
      defineProperty(
        this,
        'validation',
        readOnly(`record.validations.attrs.${this.recordValuePath}`)
      );
    } else {
      defineProperty(
        this,
        'validation',
        readOnly(`model.validations.attrs.${this.valuePath}`)
      );
    }
  },

  focusIn() {
    this._super(...arguments);
    once(this, 'setFocused', true);
    once(this, 'selectText');
  },

  focusOut() {
    this._super(...arguments);
    once(this, 'setFocused', false);
  },

  setFocused(value) {
    this.set('isFocused', value);
  },

  selectText() {
    this.element.querySelector('input, textarea:not(.alt-select)')?.select();
  },

  setValue(value) {
    if (this.transformValue) {
      value = this.transformValue(value);
    }

    this.set(`model.${this.valuePath}`, value);

    if (this.change) {
      this.change(value);
    }
  },

  actions: {
    buttonAction() {
      this.buttonAction();
    },

    clear() {
      this.setValue('');
    }
  }
});
