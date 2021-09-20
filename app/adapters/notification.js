import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  ajaxOptions(url, type, options = {}) {
    let hash = this._super(url, type, options);

    if (options.dataType) {
      hash.dataType = options.dataType;
    }

    return hash;
  },

  readAll(modelName) {
    let url = `${this.buildURL(modelName)}/read_all`;
    return this.ajax(url, 'PUT', {
      dataType: 'text'
    });
  }
});
