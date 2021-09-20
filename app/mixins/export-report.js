import Mixin from '@ember/object/mixin';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Mixin.create({
  recordsChannel: service(),
  organization: service(),
  modals: service(),
  currentOrganization: readOnly('organization.current'),

  startRecordListener(summary) {
    this.flashMessages.add({
      type: 'info',
      title: 'Your download will begin shortly',
      message:
        'Keep this tab open to start your download, or we’ll email you a download link if you close this tab.'
    });
    let subscribed = true;
    let channel = this.recordsChannel;
    let subscription = channel.subscribe('Download', summary.get('id'), () => {
      unsubscribe();
      summary.reload().then((result) => {
        location.replace(result.get('url'));
      });
    });
    let unsubscribe = function () {
      if (subscribed) {
        channel.unsubscribe(subscription);
        subscribed = false;
      }
    };
  },

  actions: {
    exportXls() {
      let summary = this.store.createRecord('exportReport', {
        options: this.model.query,
        organization: this.currentOrganization,
        type: this.exportType
      });

      summary.save().then(
        () => {
          this.startRecordListener(summary);
        },
        () => {
          this.flashMessages.add({
            type: 'error',
            title: 'Export failed'
          });
        }
      );
    }
  }
});
