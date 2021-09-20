import Component from '@ember/component';
import { guidFor } from '@ember/object/internals';
import { computed } from '@ember/object';

export default Component.extend({
  type: 'checkbox',
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _classNames: ['tw-checkbox'],
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _classNameBindings: ['showErrors:error'],

  fieldId: computed(function () {
    return guidFor(this);
  })
});
