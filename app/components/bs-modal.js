import Component from '@ember/component';
import ModalController from 'frontend/mixins/controllers/modal';
import { computed } from '@ember/object';
import { bind } from '@ember/runloop';

export default Component.extend(ModalController, {
  attributeBindings: ['role'],
  classNames: ['tw-modal'],

  dismissLabel: null,
  acceptLabel: null,
  closeOnAccept: true,
  role: 'dialog',

  modalName: computed('name', function () {
    return `modal-${this.name}`;
  }),

  init() {
    this._super(...arguments);
    this.handlers = {
      keyup: bind(this, this._onKeyup),
      click: bind(this, this._onClick)
    };
  },

  didInsertElement() {
    this._super(...arguments);

    Object.entries(this.handlers).forEach(([event, handler]) =>
      document.addEventListener(event, handler)
    );
  },

  willDestroyElement() {
    this._super(...arguments);

    Object.entries(this.handlers).forEach(([event, handler]) =>
      document.removeEventListener(event, handler)
    );
  },

  _onKeyup(event) {
    if (event.keyCode === 27) {
      this._close();
    }
  },

  _onClick(event) {
    if (event.target === this.element) {
      this._close();
      event.stopPropagation();
    }
  },

  _close() {
    if (this.dismiss) {
      this.dismiss();
    }

    this.close();
  },

  _dismiss() {
    this._close();
  },

  _accept() {
    if (this.accept) {
      this.accept();
    }

    if (this.closeOnAccept) {
      this.close();
    }
  },

  hasButtons: computed.or('singleActionLabel', 'acceptLabel', 'dismissLabel'),

  actions: {
    dismiss() {
      this._dismiss();
    },

    accept() {
      this._accept();
    }
  }
}).reopenClass({
  positionalParams: ['name']
});
