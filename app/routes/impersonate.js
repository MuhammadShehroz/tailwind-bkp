import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';

export default Route.extend({
  session: service(),
  organization: service(),

  model(params) {
    let { session } = this;

    this.organization.setCurrent(params.organization);

    if (session.isAuthenticated) {
      session.impersonateURL = window.location.href;
      session.invalidate();
    } else {
      let { email, token } = params;
      this.impersonate(email, token);
    }
  },

  async impersonate(email, token) {
    await this.session.authenticate('authenticator:impersonate', email, token);

    let { authenticated } = this.session.data;
    authenticated.authenticator = 'authenticator:devise';

    getOwner(this)
      .lookup('authenticator:impersonate')
      .trigger('sessionDataUpdated', authenticated);
  }
});
