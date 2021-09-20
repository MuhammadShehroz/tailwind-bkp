import { Promise } from 'rsvp';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { notEmpty } from '@ember/object/computed';
import FormBase from 'frontend/mixins/form-base';

export default Component.extend(FormBase, {
  title: 'Saved Successfully',
  message: 'Image saved successfully.',
  hasImage: notEmpty('url'),

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

  removeImageTask: task(function* () {
    yield this.removeImage();
    yield this.onSave();
    this.model.set('file', {});
  }).drop(),

  saveChain() {
    return this.model.save().then(() => {
      this.onSave();
      this.flashMessages.add({
        type: 'success',
        title: this.title,
        message: this.message,
        timeout: this.defaultTimeout
      });
    });
  },

  actions: {
    async addImage([file]) {
      let { name, type, size, data } = await this.readAsDataURL(file);
      this.logoUrl = data;
      this.model.setProperties({ file: { name, type, size, data } });
      this.save.perform();
    },

    removeImage() {
      this.removeImageTask.perform();
    }
  }
});
