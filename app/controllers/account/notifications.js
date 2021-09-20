import Controller from '@ember/controller';
import Pagination from 'frontend/mixins/pagination-info';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend(Pagination, {
  organizationMembership: service(),
  queryParams: ['page'],
  router: service(),

  page: 1,
  pagination: reads('model.meta.pagination'),

  init() {
    this._super(...arguments);

    this.messageRoute = {
      invoice: 'invoices',
      estimate: 'estimates'
    };
  },

  actions: {
    readAllNotifications() {
      this.organizationMembership.readAllNotification().then(() => {
        this.send('refreshModel');
      });
    },

    readMessage(notification) {
      let { subjectId, subjectType, subjectRoute, readAt } = notification;

      if (!readAt) notification.save();

      let messageRoute = this.messageRoute[subjectType];
      if (subjectId && subjectRoute && messageRoute) {
        this.router.transitionTo(`${messageRoute}.${subjectRoute}`, subjectId);
      }
    },

    markMessageRead(notification) {
      notification.save();
    },

    gotoSettings() {
      this.router.transitionTo('account.notification-settings');
    }
  }
});
