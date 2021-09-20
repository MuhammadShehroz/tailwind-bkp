import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { readOnly, gt, or } from '@ember/object/computed';

export default Controller.extend({
  organization: service(),
  user: service(),
  modals: service(),
  store: service(),
  currentUser: readOnly('user.current'),
  defaultOrganizationId: readOnly('currentUser.defaultOrganizationId'),
  notification: service(),

  hasOrganizations: gt('model.organizations.length', 0),
  hasInvitations: gt('model.invitations.length', 0),
  hasCards: or('hasOrganizations', 'hasInvitations'),

  refreshModel() {
    this.set('model.invoices', this.store.query('invitation', {}));
    this.set('model.organizations', this.store.query('organization', {}));
  },

  actions: {
    loadOrganization(organization) {
      this.notification.unsubscribe();
      this.organization.setCurrent(organization.id);
      this.store.unloadAllVitalRecords();
      this.transitionToRoute('index');
    },

    makeDefault(organization) {
      this.currentUser.then((user) => {
        user.set('defaultOrganizationId', organization.id);
        user.save().then(() => {
          this.flashMessages.success(`${organization.name} set as default`);
        });
      });
    },

    acceptInvitation(invitation) {
      invitation.accept().then(() => {
        this.flashMessages.success('Invitation accepted');
        this.store.unloadRecord(invitation);
        this.refreshModel();
      });
    },

    declineInvitation(invitation) {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        model: invitation,
        headerTitle: 'Decline Invitation',
        title: 'Are you sure you want to decline this invitation?',
        confirmButtonLabel: 'Yes, decline invitation',
        confirm: () => {
          invitation.decline().then(() => {
            this.flashMessages.success('Invitation declined');
            this.store.unloadRecord(invitation);
          });
        }
      });
    }
  }
});
