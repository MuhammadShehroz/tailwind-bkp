import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import { hash } from 'rsvp';

export default AuthenticatedRoute.extend({
  titleToken: 'Accounts Hub',
  layout: 'accounts-hub',

  model() {
    return hash({
      organizations: this.store.query('organization', {}),
      invitations: this.store.query('invitation', {})
    });
  }
});
