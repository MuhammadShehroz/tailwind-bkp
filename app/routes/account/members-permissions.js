import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import { hash } from 'rsvp';

export default AuthenticatedRoute.extend({
  titleToken: 'Members & Permissions',

  model() {
    return hash({
      invitations: this.store.findAll('invitation'),
      members: this.store.findAll('member')
    });
  }
});
