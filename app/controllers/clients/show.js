import Controller from '@ember/controller';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Breadcrumbs from 'frontend/mixins/controllers/breadcrumbs';

export default Controller.extend(Breadcrumbs, {
  modals: service(),

  hasInvoices: notEmpty('clientStats'),

  actions: {
    archive() {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        model: this.model,
        headerTitle: 'Archive Client',
        title: 'Are you sure you want to archive this client?',
        message:
          'Are you sure you want to archive this client? All of its data will be hidden, but not deleted. You can unarchive a client at any time.',

        confirmButtonLabel: 'Yes, archive this client',
        confirm: () => {
          this.model.archive().then(() => {
            this.flashMessages.success(`"${this.model.name}" archived.`);
            this.model.reload();
          });
        }
      });
    },

    unarchive() {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        model: this.model,
        headerTitle: 'Unarchive Client',
        title: 'Are you sure you want to unarchive this client?',
        message:
          'Are you sure you want to unarchive this client? All of its data will be restored.',

        confirmButtonLabel: 'Yes, unarchive this client',
        confirm: () => {
          this.model.unarchive().then(() => {
            this.flashMessages.success(`"${this.model.name}" unarchived.`);
            this.model.reload();
          });
        }
      });
    },

    delete() {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        headerTitle: 'Delete Client',
        title: `Are you sure you want to delete "${this.model.name}"?`,
        message:
          'All traces of this client, including any contacts, invoices, and estimates will be immediately and permanently deleted. You cannot undo this action.',

        confirmButtonLabel: 'Delete client',
        cancelButtonLabel: 'Keep client',
        isConfirmButtonStyleDanger: true,
        confirm: () => {
          this.model.destroyRecord().then(() => {
            this.flashMessages.success(
              `"${this.model.name}" and all of its Contacts, Invoices, and Estimates deleted.`
            );
            this.transitionToRoute('clients.index');
          });
        }
      });
    },

    destroyContact(contact) {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        headerTitle: 'Delete Contact',
        title: `Are you sure you want to delete "${contact.get('name')}"?`,
        confirmButtonLabel: 'Delete contact',
        cancelButtonLabel: 'Keep contact',
        isConfirmButtonStyleDanger: true,
        confirm: () => {
          contact.destroyRecord().then(() => {
            this.flashMessages.success(`"${contact.get('name')}" deleted.`);
          });
        }
      });
    }
  }
});
