import { A } from '@ember/array';
import { next } from '@ember/runloop';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { empty, notEmpty } from '@ember/object/computed';
import { typeOf } from '@ember/utils';

export default Component.extend({
  isOpen: false,
  isHidden: true,
  showErrors: false,
  errorMessage: '',
  onChange: () => {},

  hasLeadingIcon: notEmpty('leadingIcon').readOnly(),
  optionsIsEmpty: empty('options'),

  init() {
    this._super(...arguments);
    this.set('options', this.options || A());
    this.set(
      'selected',
      this.selected || this.options.findBy(this.optionKey, this.value)
    );
  },

  toggle() {
    this.toggleProperty('isOpen');
  },

  close() {
    this.set('isOpen', false);
  },

  defaultPlaceholder: computed(
    'placeholder',
    'emptyPlaceholder',
    'options.length',
    function () {
      return this.options?.length ? this.placeholder : this.emptyPlaceholder;
    }
  ),

  actions: {
    toggle() {
      if (this.isOpen === false) {
        this.set('isHidden', false);
      }

      next(this, 'toggle');
    },

    close() {
      if (this.isOpen) {
        next(this, 'close');
      }
    },

    select(option) {
      this.setProperties({
        selected: option,
        value:
          typeOf(this.value) === 'instance' ? option : option[this.optionKey],

        isOpen: false
      });
      this.onChange(option);
    }
  }
});
