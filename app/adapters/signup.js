import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForCreateRecord(modelName, snapshot) {
    let url = this._super(...arguments);
    return this.urlForSave(url, snapshot);
  },

  urlForUpdateRecord(id, modelName, snapshot) {
    let url = this._super(...arguments);
    return this.urlForSave(url, snapshot);
  },

  urlForSave(url, snapshot) {
    if (snapshot.adapterOptions && snapshot.adapterOptions.isValidate) {
      url = `${url}/validate`;
    } else {
      url = `${url}/save`;
    }

    return url;
  }
});
