import Devise from 'ember-simple-auth/authenticators/devise';
import { run } from '@ember/runloop';
import { Promise } from 'rsvp';

import ENV from 'frontend/config/environment';

export default Devise.extend({
  authenticate(identification, token) {
    return new Promise((resolve, reject) => {
      let { resourceName, identificationAttributeName } = this;
      let data = {};

      data[resourceName] = { token };
      data[resourceName][identificationAttributeName] = identification;

      this.makeRequest(data, { url: `${ENV.APP.apiHost}/users/impersonate` })
        .then((response) => {
          response.json().then((json) => {
            run(null, resolve, json);
          });
        })
        .catch((error) => run(null, reject, error));
    });
  }
});
