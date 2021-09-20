import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import { inject as service } from '@ember/service';

export default AuthenticatedRoute.extend({
  organizationMembership: service(),
  titleToken: 'Notification Settings',

  model() {
    return this.organizationMembership.current;
  }
});
