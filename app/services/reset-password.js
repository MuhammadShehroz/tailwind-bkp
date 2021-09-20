import Service, { inject as service } from '@ember/service';
import ENV from 'frontend/config/environment';

const RESET_PASSWORD_URL = `${ENV.APP.apiHost}/users/reset-password`;
const UPDATE_PASSWORD_URL = `${ENV.APP.apiHost}/users/update-password`;

export default Service.extend({
  store: service(),
  ajax: service(),

  sendResetPasswordEmail(email) {
    let adapter = this.store.adapterFor('applicationAdapter');
    let ajaxOptions = adapter.ajaxOptions(RESET_PASSWORD_URL, 'POST', {
      data: { user: { email } }
    });

    return this.ajax.request(RESET_PASSWORD_URL, ajaxOptions);
  },

  changePassword(password, passwordConfirmation, token) {
    let adapter = this.store.adapterFor('applicationAdapter');
    let ajaxOptions = adapter.ajaxOptions(RESET_PASSWORD_URL, 'PUT', {
      dataType: 'json',
      data: {
        user: {
          password,
          password_confirmation: passwordConfirmation, // eslint-disable-line camelcase
          reset_password_token: token // eslint-disable-line camelcase
        }
      }
    });

    return this.ajax.raw(RESET_PASSWORD_URL, ajaxOptions);
  },

  updatePassword(user) {
    let adapter = this.store.adapterFor('applicationAdapter');
    let ajaxOptions = adapter.ajaxOptions(UPDATE_PASSWORD_URL, 'POST', {
      dataType: 'json',
      data: {
        user: {
          id: user.id,
          current_password: user.currentPassword, // eslint-disable-line camelcase
          password: user.password
        }
      }
    });

    return this.ajax.raw(UPDATE_PASSWORD_URL, ajaxOptions);
  }
});
