import Component from '@ember/component';
import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default Component.extend({
  tagName: '',
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _classNames: ['tw-textarea'],
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  _classNameBindings: ['showErrors:error'],

  fieldId: computed(function () {
    return guidFor(this);
  })
});
