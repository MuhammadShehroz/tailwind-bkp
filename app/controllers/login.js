import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import FormBase from 'frontend/mixins/form-base';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';
import ValidationError from 'frontend/utils/errors/validation-error';
import AuthenticationError from 'frontend/utils/errors/authentication-error';
import { alias } from '@ember/object/computed';

import { validator, buildValidations } from 'ember-cp-validations';
import EmberObject, { computed, observer } from '@ember/object';
import { getOwner } from '@ember/application';

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

      description: 'Login'
    }),
    validator('format', {
      type: 'email',
      disabled: computed(
        'model.{emailHasChanged,validationsEnabled}',
        function () {
          return !(this.model.emailHasChanged || this.model.validationsEnabled);
        }
      ),

      description: 'Login'
    })
  ],

  password: [
    validator('ds-error', true),
    validator('presence', {
      presence: true,
      disabled: computed(
        'model.{passwordHasChanged,validationsEnabled}',
        function () {
          return !(
            this.model.passwordHasChanged || this.model.validationsEnabled
          );
        }
      ),

      description: 'Password'
    }),
    validator('length', {
      min: 6,
      max: 128,
      disabled: computed(
        'model.{passwordHasChanged,validationsEnabled}',
        function () {
          return !(
            this.model.passwordHasChanged || this.model.validationsEnabled
          );
        }
      ),

      description: 'Password'
    })
  ]
});

const Login = EmberObject.extend(Validations, {
  email: '',
  password: '',
  validationsEnabled: false,
  emailHasChanged: false,
  passwordHasChanged: false,
  // eslint-disable-next-line ember/no-observers
  emailObserver: observer('email', function () {
    this.set('emailHasChanged', true);
  }),

  // eslint-disable-next-line ember/no-observers
  passwordObserver: observer('password', function () {
    this.set('passwordHasChanged', true);
  })
});

export default Controller.extend(FormBase, {
  session: service(),
  organization: service(),
  modals: service(),
  loader: service(),
  validations: alias('model.validations.attrs'),

  init() {
    this._super(...arguments);
    this.set('model', Login.create(getOwner(this).ownerInjection()));
  },

  header: computed(function () {
    return document.querySelector('.header');
  }),

  subheader: computed(function () {
    return document.querySelector('.subheader');
  }),

  authenticate: task(function* (event) {
    event.preventDefault();
    this.loader.startLoading();
    this.set('model.validationsEnabled', true);
    yield this.validateForm()
      .then(
        () =>
          this.session
            .authenticate(
              'authenticator:devise',
              this.model.email,
              this.model.password
            )
            .catch(async (reason) => {
              let { error } = await reason.json();
              this.set('errorMessage', error);
              throw new AuthenticationError(error);
            }),
        (error) => {
          throw new ValidationError(error);
        }
      )
      .then(() =>
        this.flashMessages.add({
          type: 'success',
          title: 'Login',
          message: 'Successfully logged in.',
          timeout: this.defaultTimeout
        })
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
  }).drop()
});
