import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { notEmpty } from '@ember/object/computed';
import { isBlank } from '@ember/utils';
import { capitalize } from '@ember/string';
import { next } from '@ember/runloop';

export default Component.extend({
  store: service(),
  isEmbedded: notEmpty('delegate'),

  newButtonLabel: null,
  emptyMessage: null,
  itemType: null,

  selectedItem: null,
  isValidationDisplayed: false,

  didInsertElement() {
    this._super(...arguments);
    this.setupDelegate();
  },

  willDestroyElement() {
    this.cancelEdit();
    this.teardownDelegate();
    this._super(...arguments);
  },

  setupDelegate() {
    if (this.delegate) {
      this.set('delegate.embeddedContent', this);
    }
  },

  teardownDelegate() {
    if (this.delegate) {
      this.set('delegate.embeddedContent', null);
    }
  },

  edit(item) {
    if (this.selectedItem) {
      this.set('isValidationDisplayed', true);
    }

    if (this.selectedIsValid()) {
      this.set('isValidationDisplayed', false);
      this.set('selectedItem', item);
    } else {
      this.flashMessages.add({
        type: 'error',
        timeout: this.defaultTimeout,
        title: `Error Adding ${capitalize(this.itemType)}`,
        message: this.selectedItem?.validations?.message
      });
    }
  },

  save() {
    this.set('isValidationDisplayed', true);
    let modified = this.items.filter((item) => item.hasDirtyAttributes);
    if (modified.every((item) => item.validations.isValid)) {
      Promise.all(modified.map((item) => item.save()))
        .then(() => {
          this.reset();
          this.refreshData();
          next(() =>
            this.flashMessages.add({
              type: 'success',
              timeout: this.defaultTimeout,
              title: `Save ${capitalize(this.itemType)}`,
              message: `"${this.buildNameForMessage(
                modified.firstObject
              )}" is saved successfully.`
            })
          );
        })
        .catch((data) => {
          this.flashMessages.add({
            type: 'error',
            timeout: this.defaultTimeout,
            title: `Saving ${capitalize(this.itemType)} Error`,
            message: data.errors.firstObject.detail
          });
        });
    } else {
      this.flashMessages.add({
        type: 'error',
        timeout: this.defaultTimeout,
        title: `Saving ${capitalize(this.itemType)} Error`,
        message: this.selectedItem?.validations?.message
      });
    }
  },

  delete(item) {
    this.flashMessages.clearMessages();
    item.destroyRecord();
    this.flashMessages.add({
      type: 'success',
      timeout: this.defaultTimeout,
      title: `Delete ${capitalize(this.itemType)}`,
      message: `"${this.buildNameForMessage(item)}" is deleted.`,
      componentName: 'flash-messages/undo-button',
      componentContent: 'Undo item',
      componentAction: () => this.restore(item)
    });
  },

  restore(destroyedItem) {
    this.flashMessages.clearMessages();
    destroyedItem.rollbackAttributes();
    this.flashMessages.add({
      type: 'success',
      timeout: this.defaultTimeout,
      title: `Restore ${capitalize(this.itemType)}`,
      message: `"${this.buildNameForMessage(destroyedItem)}" restored.`
    });
  },

  selectedIsValid() {
    return (
      isBlank(this.selectedItem) ||
      (this.selectedItem && this.selectedItem?.validations?.isValid)
    );
  },

  newItem() {
    if (this.selectedItem) {
      this.set('isValidationDisplayed', true);
    }

    if (this.selectedIsValid()) {
      this.set('isValidationDisplayed', false);
      let item = this.store.createRecord(this.itemType);
      this.set('selectedItem', item);
    } else {
      this.flashMessages.add({
        type: 'error',
        timeout: this.defaultTimeout,
        title: `Add a ${capitalize(this.itemType)}`,
        message: this.selectedItem?.validations?.message
      });
    }
  },

  cancelEdit() {
    this.items
      .filter((item) => item.hasDirtyAttributes)
      .forEach((item) => item.rollbackAttributes());
    this.reset();
  },

  cancel() {
    this.cancelEdit();
  },

  reset() {
    this.set('isValidationDisplayed', false);
    this.set('selectedItem', null);
    this.flashMessages.clearMessages();
  },

  buildNameForMessage(item) {
    return `item ${item.get('id')}`;
  },

  refreshData() {},

  actions: {
    edit(item) {
      this.edit(item);
    },

    save() {
      this.save();
    },

    cancelEdit() {
      this.cancelEdit();
    },

    delete(item) {
      this.delete(item);
    },

    newItem() {
      this.newItem();
    },

    cancel() {
      this.cancel();
      this.onClose();
    }
  }
});
