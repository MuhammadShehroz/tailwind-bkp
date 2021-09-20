import Component from '@ember/component';
import { computed } from '@ember/object';
import FormBase from 'frontend/mixins/form-base';
import { getPaletteFromImage } from 'frontend/utils/color';

export default Component.extend(FormBase, {
  tagName: 'form',
  novalidate: true,
  successTitle: 'Header Color Saved',
  successMessage: 'Header color saved successfully.',
  attributeBindings: ['novalidate'],

  url: computed('model.logoUrl', 'logoUrl', function () {
    return this.logoUrl || this.model.get('logoUrl');
  }),

  saveChain() {
    return this.model.save().then(() => {
      this.onSave();
      this.flashMessages.add({
        type: 'success',
        title: this.successTitle,
        message: this.successMessage,
        timeout: this.defaultTimeout
      });
      this.close();
    });
  },

  actions: {
    cancel() {
      this._super();
      this.close();
    },

    changeHeaderColor(color) {
      this.model.set('headerColor', color);
    },

    onLoadLogo({ target }) {
      this.set('extractedColors', getPaletteFromImage(target));
    }
  }
});
