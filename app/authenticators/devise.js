import Devise from 'ember-simple-auth/authenticators/devise';
import ENV from 'frontend/config/environment';

export default Devise.extend({
  serverTokenEndpoint: `${ENV.APP.apiHost}/users/sign_in`,
  rejectWithResponse: true
});
