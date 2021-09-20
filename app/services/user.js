import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, reads, readOnly } from '@ember/object/computed';
import { reject } from 'rsvp';
import delegate from 'frontend/lib/delegate';

const delegations = delegate(readOnly, 'current', [
  'email',
  'name',
  'nameOrEmail',
  'initials',
  'avatarWebUrl',
  'hasAvatar',
  'defaultOrganizationId'
]);

export default Service.extend(delegations, {
  metrics: service(),
  session: service(),
  store: service(),
  organization: service(),

  userId: reads('session.data.authenticated.user_id'),
  isAuthenticated: alias('session.isAuthenticated'),

  current: computed('session.isAuthenticated', function () {
    if (this.session.isAuthenticated) {
      return this.store.queryRecord('user', { me: true });
    } else {
      return reject();
    }
  }),

  roleLabel(role) {
    if (role === 'member') {
      return 'Member';
    }

    return 'Account Owner';
  }
});
