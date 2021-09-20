import Controller from '@ember/controller';
import { getOwner } from '@ember/application';
import { alias } from '@ember/object/computed';
import FormBase from 'frontend/mixins/form-base';
import { inject as service } from '@ember/service';
import { validator, buildValidations } from 'ember-cp-validations';
import EmberObject, { computed, observer } from '@ember/object';

const Validations = buildValidations({
  email: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      disabled: computed(
        'model.{emailHasChanged,validationsEnabled}',
        function () {
          return !(this.model.emailHasChanged || this.model.validationsEnabled);
        }
      ),

      description: 'Email Address'
    }),
    validator('format', {
      type: 'email',
      disabled: computed(
        'model.{emailHasChanged,validationsEnabled}',
        function () {
          return !(this.model.emailHasChanged || this.model.validationsEnabled);
        }
      ),

      description: 'Email Address'
    })
  ]
});

const ForgotPassword = EmberObject.extend(Validations, {
  email: '',
  validationsEnabled: false,
  emailHasChanged: false,
  // eslint-disable-next-line ember/no-observers
  emailObserver: observer('email', function () {
    this.set('emailHasChanged', true);
  })
});

export default Controller.extend(FormBase, {
  resetPassword: service(),

  header: computed(function () {
    return document.querySelector('.header');
  }),

  validations: alias('model.validations.attrs'),

  init() {
    this._super(...arguments);
    this.set('model', ForgotPassword.create(getOwner(this).ownerInjection()));
  },

  saveChain() {
    let { email } = this.model;
    return this.resetPassword.sendResetPasswordEmail(email).then(() => {
      this.transitionToRoute('login');
      this.flashMessages.add({
        type: 'success',
        title: `Email sent to ${email}`,
        message: 'Please check this email for a link to reset your password.',
        timeout: this.defaultTimeout
      });
    });
  }
});
