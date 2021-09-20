import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Controller.extend({
  organization: service(),
  organizationMembership: service(),
  modals: service(),

  memberSinceDate: readOnly('organizationMembership.current.createdAt'),

  actions: {
    cancel() {
      this.transitionToRoute('index');
    }
  }
});
