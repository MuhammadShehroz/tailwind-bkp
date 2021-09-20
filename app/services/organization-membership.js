import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Service.extend({
  organization: service(),
  user: service(),
  store: service(),
  portal: service(),
  infinity: service(),

  userId: readOnly('user.userId'),
  organizationId: readOnly('organization.organizationId'),

  current: computed('organizationId', 'portal.isActive', 'userId', function () {
    if (!this.portal.isActive && this.userId && this.organizationId) {
      return this.store.queryRecord('organization-membership', {
        current: true
      });
    } else {
      return this.store.createRecord('organization-membership');
    }
  }),

  notifications() {
    return this.infinity.model('notification', {
      perPageParam: 'page[size]',
      pageParam: 'page[number]',
      totalPagesParam: 'meta.pagination.last.number',
      countParam: 'meta.pagination.self.number'
    });
  },

  readAllNotification() {
    let adapter = this.store.adapterFor('notification');
    return adapter.readAll('notification');
  }
});
