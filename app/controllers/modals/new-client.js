import { readOnly, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ModalController from 'frontend/mixins/controllers/modal';
import ClientController from 'frontend/controllers/clients/new-edit';
import { scrollToErrorField } from 'frontend/utils/scroller';
import ValidationError from 'frontend/utils/errors/validation-error';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';

export default ClientController.extend(ModalController, {
  metrics: service(),
  client: readOnly('model'),
  validations: alias('client.validations.attrs'),

  validateForm() {
    return this.client.validate().then(() => {
      if (this.client.validations.isValid) {
        return Promise.resolve(this.model);
      } else {
        scrollToErrorField();
        return Promise.reject(this.client.validations.errors);
      }
    });
  },

  saveChain() {
    return this.client.save().then(() => {
      this.flashMessages.add({
        type: 'success',
        title: 'Successfully saved.',
        message: 'Saved successfully',
        timeout: this.defaultTimeout
      });
      this.created(this.client);
      this.metrics.trackEvent({ event: 'client_added' });
      this.close();
    });
  },

  save: task(function* (options) {
    this.loader.startLoading();
    this.client.set('validationsEnabled', true);
    yield this.validateForm()
      .then(
        () => this.saveChain(options),
        (error) => {
          throw new ValidationError(error);
        }
      )
      .catch((error) =>
        this.flashMessages.add({
          type: 'error',
          title: error.name,
          message: htmlSafe(error.message),
          timeout: this.defaultTimeout
        })
      )
      .finally(() => this.loader.endLoading());
  }).drop(),

  actions: {
    cancel() {
      this.client.rollbackAttributes();
      this.close();
    },

    save() {
      this.save.perform();
    },

    async fetchSubregions() {
      this.set(
        'subregions',
        await this.fetchSubregions(this.client.billingAddress.country)
      );
    }
  }
});
