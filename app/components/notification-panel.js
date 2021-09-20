import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { and, empty, readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [
    'notifications.length:has-notification',
    'onLanding:landing-page'
  ],

  organizationMembership: service(),
  router: service(),
  store: service(),

  noNotification: empty('notifications').readOnly(),
  hasNoContent: and('notifications.isFulfilled', 'noNotification').readOnly(),

  unreadCount: readOnly(
    'organizationMembership.current.unreadNotificationsCount'
  ),

  init() {
    this._super(...arguments);

    this.messageRoute = {
      invoice: 'invoices',
      estimate: 'estimates'
    };
  },

  actions: {
    readMessage(notification, pc) {
      let { subjectId, subjectType, subjectRoute, readAt } = notification;

      pc && pc.hide();
      if (!readAt) notification.save();

      let messageRoute = this.messageRoute[subjectType];
      if (subjectId && subjectRoute && messageRoute) {
        this.router.transitionTo(`${messageRoute}.${subjectRoute}`, subjectId);
      }
    },

    viewAll(pc) {
      pc && pc.hide();
      this.router.transitionTo('account.notifications');
    },

    viewSettings(pc) {
      pc && pc.hide();
      this.router.transitionTo('account.notification-settings');
    }
  }
});
