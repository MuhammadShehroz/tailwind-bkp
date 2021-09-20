import Mixin from '@ember/object/mixin';
import { task } from 'ember-concurrency';
import config from 'frontend/config/environment';
import { inject as service } from '@ember/service';
import { classify, htmlSafe } from '@ember/string';

export default Mixin.create({
  defaultTimeout: config.flashMessageRegularTimeout,
  actionTimeout: config.flashActionMessageTimeout,
  successTitle: 'Success',
  successMessage: 'Deleted successfully',
  errorTitle: 'Failure',

  loader: service(),

  itemName(item) {
    return item.name || item.id;
  },

  deleteChain(model, options) {
    return model.destroyRecord(options).then(() => {
      this.flashMessages.add({
        type: 'success',
        title: this.successTitle,
        message: this.successMessage,
        timeout: this.defaultTimeout
      });
      return Promise.resolve();
    });
  },

  delete: task(function* (model, options = {}) {
    this.loader.startLoading();
    yield this.deleteChain(model, options)
      .catch((error) =>
        this.flashMessages.add({
          type: 'error',
          title: this.errorTitle,
          message: htmlSafe(error.message),
          timeout: this.defaultTimeout
        })
      )
      .finally(() => this.loader.endLoading());
  }).drop(),

  restore: task(function* (model) {
    this.loader.startLoading();
    let { id, modelName } = model;
    model.unloadRecord();
    yield model.store
      .restoreRecord(modelName, id)
      .then(
        (tax) => {
          this.flashMessages.add({
            type: 'success',
            timeout: this.defaultTimeout,
            title: `Restore ${classify(modelName)}`,
            message: `"${this.itemName(tax)}" restored.`
          });
        },
        (error) => {
          this.flashMessages.add({
            type: 'error',
            timeout: this.defaultTimeout,
            title: `Error restoring ${classify(modelName)}`,
            message: error.message
          });
        }
      )
      .finally(() => this.loader.endLoading());
  }).drop(),

  actions: {
    delete(model) {
      this.delete.perform(model);
    }
  }
});
