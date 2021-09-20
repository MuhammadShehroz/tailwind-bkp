import Controller from '@ember/controller';
import DocumentsShowController from 'frontend/mixins/controllers/documents/show';

const inlineActionsDisplay = {
  showSend: false,
  showReminder: false,
  showPayment: false,
  showThankYou: false
};

export default Controller.extend(
  DocumentsShowController,
  inlineActionsDisplay,
  {
    hideActions() {
      this.setProperties(inlineActionsDisplay);
    },

    actions: {
      newComment() {
        return this.newComment();
      },

      removePayment(payment) {
        this.modals.open('confirm-modal', {
          controller: 'modals.confirm-modal',
          headerTitle: 'Delete Payment',
          title: 'Are you sure you want to delete this Payment?',
          confirmButtonLabel: 'Delete payment',
          cancelButtonLabel: 'Keep payment',
          isConfirmButtonStyleDanger: true,
          confirm: () => {
            payment.destroyRecord().then(() => {
              payment.unloadRecord();
              this.flashMessages.success('Payment deleted.');
              this.model.reload();
              this.reloadEvents();
            });
          }
        });
      },

      receivePayment(payment) {
        payment.save().then(() => {
          this.flashMessages.success('Payment received.');
          this.model.reload();
          this.reloadEvents();
        });
        this.hideActions();
      }
    }
  }
);
