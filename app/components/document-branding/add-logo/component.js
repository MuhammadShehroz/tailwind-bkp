import Component from '@ember/component';
import FormBase from 'frontend/mixins/form-base';

export default Component.extend(FormBase, {
  tagName: 'form',
  novalidate: true,
  successTitle: 'Logo Image Saved',
  successMessage: 'Logo image saved successfully.',
  attributeBindings: ['novalidate'],

  readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();

      fileReader.onload = ({ target }) =>
        resolve({
          name: file.name,
          type: file.type,
          data: target.result,
          size: file.size
        });
      fileReader.onerror = reject;

      fileReader.readAsDataURL(file);
    });
  },

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
      this.close();
    },

    cleanLogo() {
      this.set('logoUrl', null);
    },

    async addLogo([file]) {
      let { name, type, size, data } = await this.readAsDataURL(file);
      this.set('logoUrl', data);
      this.model.setProperties({
        logoUrl: data,
        file: { name, type, size, data }
      });
    },

    update() {
      if (this.logoUrl) {
        this.save.perform();
      } else {
        this.removeLogo(this.organization.id);
        this.onSave();
        this.close();
      }
    }
  }
});
