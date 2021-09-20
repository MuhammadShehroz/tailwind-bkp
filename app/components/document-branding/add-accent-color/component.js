import tinycolor from 'tinycolor2';
import Component from '@ember/component';
import { computed } from '@ember/object';
import FormBase from 'frontend/mixins/form-base';
import { getPaletteFromURL } from 'frontend/utils/color';

export default Component.extend(FormBase, {
  tagName: 'form',
  novalidate: true,
  successTitle: 'Accent Color Saved',
  successMessage: 'Accent color saved successfully.',
  attributeBindings: ['novalidate'],

  url: computed('model.logoUrl', 'logoUrl', function () {
    return this.logoUrl || this.model.get('logoUrl');
  }),

  isDarkColor: computed('model.buttonColor', function () {
    return tinycolor(this.model.get('buttonColor')).isDark();
  }),

  isWhiteColor: computed('model.buttonColor', function () {
    let color = this.model.get('buttonColor')?.toLowerCase();
    return color === '#ffffff' || color === '#fff';
  }),

  colorPalette: computed('logoUrl', async function () {
    return getPaletteFromURL(this.logoUrl);
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
    changeAccentColor(color) {
      this.model.set('buttonColor', color);
      this.model.set(
        'buttonLabelColor',
        this.isDarkColor ? '#ffffff' : '#354656'
      );
      this.model.set(
        'buttonHoverColor',
        this.isDarkColor
          ? tinycolor(color).lighten(10).toHexString()
          : tinycolor(color).darken(4).toHexString()
      );
    },

    cancel() {
      this._super();
      this.close();
    }
  }
});
