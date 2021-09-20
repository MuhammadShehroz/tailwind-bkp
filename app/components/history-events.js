import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { notEmpty, readOnly } from '@ember/object/computed';

export default Component.extend({
  modals: service(),
  hasEvents: notEmpty('events'),

  portal: service(),
  isPortal: readOnly('portal.isActive'),

  hideCommentForm() {
    this.set('isCommentFormExpanded', false);
  },

  actions: {
    hideCommentForm() {
      this.hideCommentForm();
    },

    showCommentForm() {
      this.set('isCommentFormExpanded', true);
    },

    updateViewAfterComment() {
      this.hideCommentForm();
      this.reloadEvents();
    },

    remove(historyEvent) {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        headerTitle: 'Delete Event',
        title: 'Are you sure you want to delete this Event?',
        confirmButtonLabel: 'Delete event',
        cancelButtonLabel: 'Keep event',
        isConfirmButtonStyleDanger: true,
        confirm: () => {
          historyEvent
            .destroyRecord({
              adapterOptions: {
                documentId: this.model.id,
                documentType: this.model.modelName
              }
            })
            .then(() => {
              this.flashMessages.success('Event deleted.');
            });
        }
      });
    }
  }
});
