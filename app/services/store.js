import Store from '@ember-data/store';

export default Store.extend({
  restoreRecord(modelName, id) {
    let record = this.findRecord(modelName, id, {
      adapterOptions: {
        isRestoreMode: true
      }
    });
    return record;
  },

  unloadAllVitalRecords() {
    this.unloadAll('invoice');
    this.unloadAll('estimate');
    this.unloadAll('invoice-template');
    this.unloadAll('client');
    this.unloadAll('member');
    this.unloadAll('invitation');
    this.unloadAll('amount-stat');
    this.unloadAll('organization-membership');
  }
});
