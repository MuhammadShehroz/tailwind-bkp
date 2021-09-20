import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  elementId: 'accounts-hub-nav',
  tagName: 'header',

  user: service(),
  session: service(),
  organization: service(),

  homeRoute: computed('organization.organizationId', function () {
    return this.organization.organizationId ? 'index' : 'accounts';
  }).readOnly(),

  actions: {
    invalidateSession() {
      this.session.invalidate();
    }
  }
});
