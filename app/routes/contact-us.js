import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PagesContactUsRoute extends Route {
  @service session;

  @service organization;

  get layout() {
    if (!this.session.isAuthenticated) return 'auth';
    return this.organization.organizationId ? 'app' : 'accounts-hub';
  }
}
