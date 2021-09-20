import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'tr',
  store: service(),
  classNames: ['tw-row'],
  attributeBindings: ['isDraggable:draggable'],
  validations: alias('model.validations.attrs'),

  drop() {
    this.toPosition(this.model.get('position'));
    this.move();
  },

  dragStart() {
    this.fromPosition(this.model.get('position'));
  },

  dragOver() {
    return false;
  },

  units: computed(function () {
    return this.store.findAll('unit-of-measurement');
  }),

  actions: {
    remove() {
      this.remove(this.model);
    },

    saveToLibrary() {
      this.model.validate().then(({ validations }) => {
        let isValid = validations.get('isValid');
        this.set('showErrors', !isValid);
        if (isValid) {
          this.model.saveToLibrary().then((savedItem) => {
            if (this.model.isLoaded) {
              this.flashMessages.success('New item saved to library.');
            } else {
              this.model.set('savedItem', savedItem);
              this.flashMessages.success('Item saved to library.');
            }
          });
        }
      });
    },

    updateSavedItem() {
      this.model.validate().then(({ validations }) => {
        let isValid = validations.get('isValid');
        this.set('showErrors', !isValid);
        if (isValid) {
          let { savedItem } = this.model;
          savedItem.setProperties(this.model.defaultProperties());
          savedItem
            .save()
            .then(() => this.flashMessages.success('Item saved to library.'));
        }
      });
    }
  }
});
