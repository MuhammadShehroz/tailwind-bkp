import Service, { inject as service } from '@ember/service';
import ENV from 'frontend/config/environment';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Service.extend({
  cable: service(),
  user: service('user'),
  currentUser: readOnly('user.current'),

  consumer: computed(
    'user.isAuthenticated',
    'currentUser.{email,authorizationToken}',
    function () {
      if (this.user.isAuthenticated) {
        let endpoint = ENV.APP.apiHost.replace(/http(s)?:\/\//, 'ws$1://');
        let email = encodeURIComponent(this.currentUser.get('email'));
        let token = encodeURIComponent(
          this.currentUser.get('authorizationToken')
        );
        return this.cable.createConsumer(
          `${endpoint}/cable?email=${email}&token=${token}`
        );
      }

      return null;
    }
  ),

  anonymousConsumer: computed('', function () {
    let endpoint = ENV.APP.apiHost.replace(/http(s)?:\/\//, 'ws$1://');
    return this.cable.createConsumer(`${endpoint}/cable?`);
  }),

  subscribe(type, id, onReceived, onConnected = () => {}) {
    return this.consumer.subscriptions.create(
      { channel: 'RecordsChannel', type, id },
      {
        received: onReceived,
        connected: onConnected
      }
    );
  },

  anonymouslySubscribe(type, id, params, onReceived, onConnected = () => {}) {
    return this.anonymousConsumer.subscriptions.create(
      { channel: `${type}Channel`, id, params },
      {
        received: onReceived,
        connected: onConnected
      }
    );
  },

  anonymouslyUnsubscribe(subscription) {
    this.anonymousConsumer.subscriptions.remove(subscription);
  },

  unsubscribe(subscription) {
    this.consumer.subscriptions.remove(subscription);
  },

  subscribeTo(type, id, events) {
    return this.consumer.subscriptions.create({ channel: type, id }, events);
  }
});
