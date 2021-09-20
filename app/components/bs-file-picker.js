import { computed } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'label',
  attributeBindings: ['for', 'tabindex'],

  allowDragDrop: false,
  multiple: false,
  accept: '*',
  tabindex: 0,

  for: computed(function () {
    return `bs-file-picker__input-${guidFor(this)}`;
  }).readOnly(),

  // Drag Drop events
  dragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
  },

  dragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
  },

  dragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  },

  drop(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.allowDragDrop && this.onSelect) {
      this.onSelect(event.dataTransfer.files);
    }
  },

  actions: {
    change() {
      if (this.onSelect) {
        this.onSelect(...arguments);
      }

      this.element.querySelector('input').value = null;
    }
  }
});
