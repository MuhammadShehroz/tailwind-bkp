import Mixin from '@ember/object/mixin';

export default Mixin.create({
  routeAfterDelete: 'index',

  actions: {
    destroy(model) {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        headerTitle: 'Delete Event',
        title: `Are you sure you want to delete "${model.get('name')}"?`,
        confirmButtonLabel: 'Delete',
        cancelButtonLabel: 'Cancel',
        isConfirmButtonStyleDanger: true,
        confirm: () => {
          model
            .destroyRecord()
            .then(() => this.transitionTo(this.routeAfterDelete));
        }
      });
    }
  }
});
