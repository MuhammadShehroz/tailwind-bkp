import { A } from '@ember/array';
import Mixin from '@ember/object/mixin';
import { task } from 'ember-concurrency';
import { htmlSafe } from '@ember/string';
import config from 'frontend/config/environment';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { scrollToErrorField } from 'frontend/utils/scroller';
import ValidationError from 'frontend/utils/errors/validation-error';
import InvalidError from 'frontend/utils/errors/invalid-error';

export default Mixin.create({
  title: 'Successfully saved',
  message: 'Saved successfully.',
  defaultTimeout: config.flashMessageRegularTimeout,
  actionTimeout: config.flashActionMessageTimeout,
  validations: alias('model.validations.attrs'),

  loader: service(),

  country: computed('countries', 'model.billingAddress.country', function () {
    let countries = this.countries || A();
    return countries.findBy('code', this.model.billingAddress?.country);
  }),

  subregion: computed(
    'subregions',
    'model.billingAddress.subregion',
    function () {
      let subregions = this.subregions || A();
      return subregions.findBy('code', this.model.billingAddress?.subregion);
    }
  ),

  currency: computed('currencies.[]', 'model.currency', function () {
    let currencies = this.currencies || A();
    return currencies.findBy('code', this.model.currency);
  }),

  currencySymbol: computed('currencies.[]', 'model.currency', function () {
    return this.currencies?.findBy('code', this.model.currency)?.symbol;
  }),

  validateForm() {
    return this.model.validate().then(() => {
      if (this.model.validations.isValid) {
        return Promise.resolve(this.model);
      } else {
        scrollToErrorField();
        return Promise.reject(this.model.validations.errors);
      }
    });
  },

  saveChain() {
    return this.model.save().then(() =>
      this.flashMessages.add({
        type: 'success',
        title: this.title,
        message: this.message,
        timeout: this.defaultTimeout
      })
    );
  },

  submit(event) {
    event.preventDefault();
    this.save.perform();
  },

  save: task(function* (options) {
    this.loader.startLoading();
    this.model.set('validationsEnabled', true);
    document.querySelectorAll('input').forEach((input) => {
      input.focus();
      input.blur();
    });
    yield this.validateForm()
      .then(
        () =>
          this.saveChain(options).catch((error) => {
            throw new InvalidError(error);
          }),
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
    save() {
      this.save.perform();
    },

    cancel() {
      this.model.rollbackAttributes();
    }
  }
});
