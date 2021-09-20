import Service, { inject as service } from '@ember/service';
import { readOnly, reads } from '@ember/object/computed';
import { reject } from 'rsvp';
import delegate from 'frontend/lib/delegate';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';

const delegations = delegate(readOnly, 'current', [
  'decimalsSeparator',
  'decimals',
  'thousandsSeparator',
  'id',
  'name',
  'quantityDecimals'
]);

export default Service.extend(delegations, {
  session: service(),
  store: service(),
  router: service(),
  user: service(),
  organizationMembership: service(),
  currentMembership: reads('organizationMembership.current'),
  metrics: service(),
  notification: service(),

  defaultOrganizationId: readOnly('user.defaultOrganizationId'),
  organizationId: readOnly('session.data.organizationId'),

  current: computed(
    'organizationId',
    'currentMembership.identifier',
    function () {
      if (this.organizationId) {
        let organization = this.store.peekRecord(
          'organization',
          this.organizationId
        );

        if (this.currentMembership.get('identifier')) {
          this.metrics.identify({
            distinctId: this.currentMembership.get('identifier')
          });
        }

        this.notification.listenForNewNotifications();

        return (
          // WTF?? should returns always a promise
          organization ||
          this.store.findRecord('organization', this.organizationId)
        );
      } else {
        return reject();
      }
    }
  ),

  _current: computed(
    'organizationId',
    'currentMembership.identifier',
    function () {
      if (this.organizationId) {
        let organization = this.store.peekRecord(
          'organization',
          this.organizationId
        );

        if (this.currentMembership.get('identifier')) {
          this.metrics.identify({
            distinctId: this.currentMembership.get('identifier')
          });
        }

        this.notification.listenForNewNotifications();
        if (isBlank(organization)) {
          organization = this.store.findRecord(
            'organization',
            this.organizationId
          );
        }

        return Promise.resolve(organization);
      } else {
        return Promise.reject();
      }
    }
  ),

  load() {
    if (this.session.isAuthenticated) {
      if (this.organizationId) {
        return this.current;
      }

      return this.store.query('organization', {}).then((organizations) => {
        switch (organizations.length) {
          case 0:
            this.router.transitionTo('accounts');
            break;
          case 1:
            this.setCurrent(organizations.get('firstObject.id'));
            break;
          default:
            if (this.defaultOrganizationId) {
              this.setCurrent(this.defaultOrganizationId);
            } else {
              this.router.transitionTo('accounts');
            }
        }
      });
    } else {
      return reject();
    }
  },

  setCurrent(organizationId) {
    this.session.set('data.organizationId', organizationId);
  }
});
