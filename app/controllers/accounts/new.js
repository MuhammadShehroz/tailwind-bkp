import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import FormBase from 'frontend/mixins/form-base';
import Breadcrumbs from 'frontend/mixins/controllers/breadcrumbs';

export default Controller.extend(Breadcrumbs, FormBase, {
  metrics: service(),
  timezones: service(),
  validations: alias('model.validations.attrs'),

  timezone: computed('timezones.all', 'model.timezone', function () {
    let timezones = this.timezones.all;
    return timezones.findBy('key', this.model.timezone);
  }),

  saveChain() {
    return this.model.save().then(() => {
      this.metrics.trackEvent({
        event: 'trial_start',
        type: 'monthly'
      });

      this.transitionToRoute('accounts');

      this.flashMessages.add({
        type: 'success',
        title: 'Successfully saved',
        message: 'Business Profile has been created.',
        timeout: this.defaultTimeout
      });
    });
  },

  actions: {
    onCountryChange(country) {
      this.set('model.billingAddress.country', country.code);
    },

    onCurrencyChange(currency) {
      this.set('model.currency', currency.code);
    },

    onSelect(value) {
      this.model.set('timezone', value.get('key'));
    },

    cancel() {
      this.model.rollbackAttributes();
      this.transitionToRoute('accounts');
    }
  }
});
