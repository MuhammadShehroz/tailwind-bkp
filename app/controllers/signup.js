import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import FormBase from 'frontend/mixins/form-base';
import { task } from 'ember-concurrency';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import AuthenticationError from 'frontend/utils/errors/authentication-error';
import ValidationError from 'frontend/utils/errors/validation-error';
import StripeCardError from 'frontend/utils/errors/stripe-card-error';
import SignupError from 'frontend/utils/errors/signup-error';

export default Controller.extend(FormBase, {
  metrics: service(),
  session: service(),
  organization: service(),
  store: service(),
  loader: service(),
  planService: service('plan'),
  validations: alias('model.validations.attrs'),

  header: computed(function () {
    return document.querySelector('.header');
  }),

  subheader: computed(function () {
    return document.querySelector('.subheader');
  }),

  login() {
    let { model } = this;

    this.organization.setCurrent(null);

    return this.session
      .authenticate('authenticator:devise', model.email, model.password)
      .then(() => {
        this.flashMessages.add({
          type: 'success',
          title: 'Successfully signed up.',
          message: 'Create and send your first invoice',
          timeout: this.defaultTimeout
        });
        this.transitionToRoute('invoices.new');
      })
      .catch((response) => {
        throw new AuthenticationError(response);
      });
  },

  trackSignupEvent() {
    this.metrics.trackEvent({
      event: 'trial_start',
      type: this.planService.gtmPlan(this.model.planId)
    });
  },

  signup: task(function* () {
    this.loader.startLoading();
    let adapter = this.store.adapterFor('subscription');
    this.model.set('validationsEnabled', true);
    yield this.validateForm()
      .then(
        () => adapter.setupIntent(),
        (error) => {
          throw new ValidationError(error);
        }
      )
      .then((setupIntent) =>
        this.stripe.handleCardSetup(setupIntent.key, this.cardElements)
      )
      .then((result) => {
        if (result.error) {
          throw new StripeCardError('Invalid credit card attributes');
        } else {
          return Promise.resolve(result);
        }
      })
      .then((success) => {
        this.model.set('cardToken', success.setupIntent.payment_method);
        return this.model.save().catch((error) => {
          throw new SignupError(error);
        });
      })
      .then(() => {
        this.trackSignupEvent();
        return this.login();
      })
      .catch((error) =>
        this.flashMessages.add({
          type: 'error',
          title: error.name,
          message: htmlSafe(error.message),
          timeout: this.defaultTimeout
        })
      )
      .finally(() => this.loader.endLoading());
  }).drop()
});
