import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  modals: service(),
  store: service(),
  organization: service(),

  actions: {
    showSubcriptionEditModal() {
      let subscription = this.model;
      this.modals.open('edit-subscribe-plan', {
        model: this.model,
        controller: 'modals.edit-subscribe-plan',
        subscription,
        updateModel: () => {
          return this.model.reload();
        }
      });
    },

    showPaymentEditModal() {
      let subscription = this.model;
      this.modals.open('edit-subscribe-card', {
        model: this.model,
        controller: 'modals.edit-subscribe-plan',
        subscription,
        updateModel: () => {
          return this.model.reload();
        }
      });
    },

    removeSubscription() {
      this.modals.open('confirm-modal', {
        model: this.model,
        controller: 'modals.confirm-modal',
        headerTitle: 'Remove Subscription',
        title: 'Are you sure you want to remove your subscription?',
        confirmButtonLabel: 'Delete subscription',
        cancelButtonLabel: 'Keep subscription',
        isConfirmButtonStyleDanger: true,
        confirm: () => {
          this.controller.send('startLoading', 'Removing your subscription...');
          this.model.cancelSubscription().then(() => {
            this.controller.send('endLoading');
            this.flashMessages.success('Subscription deleted.');
            this.model.reload();
          });
        }
      });
    }
  }
});
