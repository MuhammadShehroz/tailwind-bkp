import { typeOf } from '@ember/utils';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import TextInput from 'frontend/components/form-elements/text-input';

const DEFAULT_DATE = new Date();

export default TextInput.extend({
  tagName: '',

  didInsertElement() {
    this.set('value', this.value || DEFAULT_DATE);
  },

  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _classNames: ['tw-input'],
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _classNameBindings: ['showErrors:error'],

  organization: service(),
  format: reads('organization.current.jsDateFormat'),
  useUTC: true,

  onChange: () => {},

  value: computed('internalValue', {
    get() {
      return this.internalValue || DEFAULT_DATE;
    },

    set(key, value) {
      this.set(
        'internalValue',
        typeOf(value) === 'date' ? value : DEFAULT_DATE
      );
      return value;
    }
  }),

  actions: {
    setDate(date) {
      this.set('internalValue', date);
      this.onChange(date);
    }
  }
});
