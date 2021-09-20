import Mixin from '@ember/object/mixin';
import Service, { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

const channelMixin = Mixin.create({
  store: service(),

  received() {
    this.store.queryRecord('organization-membership', {
      current: true
    });
  },

  connected() {},
  disconnected() {}
});

export default Service.extend({
  recordsChannel: service(),
  organizationMembership: service(),
  currentMembership: readOnly('organizationMembership.current'),
  store: service(),
  subscription: null,

  listenForNewNotifications() {
    let channel = this.recordsChannel;

    if (this.currentMembership.get('id')) {
      this.currentMembership.then((membership) => {
        this.subscription = channel.subscribeTo(
          'NotificationsChannel',
          membership.id,
          channelMixin
        );
      });
    }
  },

  unsubscribe() {
    if (this.subscription) {
      this.recordsChannel.unsubscribe(this.subscription);
    }
  }
});
