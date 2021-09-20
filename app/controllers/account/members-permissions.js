import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias, filterBy } from '@ember/object/computed';

export default Controller.extend({
  modals: service(),

  invitations: filterBy('model.invitations', 'isNew', false),
  members: alias('model.members'),

  closeInvitation() {
    this.set('isInvitationFormExpanded', false);
  },

  actions: {
    inviteNewMember() {
      this.set('isInvitationFormExpanded', true);
    },

    async resendInvitation(member) {
      await member.resendInvitation();
      this.flashMessages.success('Invitation resent.');
    },

    closeInvitation() {
      this.closeInvitation();
    },

    async save(member) {
      await member.save();
      this.flashMessages.success('Member saved.');
    },

    removeMember(member) {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        headerTitle: 'Delete Member',
        title: `Are you sure you want to delete "${member.email}"?`,
        message: 'This action wil remove the member from this organization',
        confirmButtonLabel: 'Delete member',
        cancelButtonLabel: 'Keep member',
        isConfirmButtonStyleDanger: true,
        confirm: async () => {
          await member.destroyRecord();
          this.flashMessages.success(
            `"${member.email}" was removed form organization.`
          );
        }
      });
    }
  }
});
