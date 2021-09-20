import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({
  elementId: 'app-nav',
  tagName: 'header',

  notificationOpenState: false,

  user: service(),
  organization: service(),
  organizationMembership: service(),
  session: service(),
  store: service(),
  currentOrganization: reads('organization.current'),
  unreadNotifications: reads(
    'organizationMembership.current.unreadNotificationsCount'
  ),

  userRoleLabel: computed('currentOrganization.currentUserRole', function () {
    return this.user.roleLabel(
      this.currentOrganization?.get?.('currentUserRole')
    );
  }),

  notifications: computed(
    'organization.organizationId',
    'notificationOpenState',
    'unreadNotifications',
    function () {
      if (this.notificationOpenState) {
        return this.organizationMembership.notifications();
      }

      return undefined;
    }
  ),

  actions: {
    invalidateSession() {
      this.session.invalidate();
    },

    setOpenState() {
      this.set('notificationOpenState', true);
    },

    markAllRead() {
      this.organizationMembership.readAllNotification();
    }
  }
});
