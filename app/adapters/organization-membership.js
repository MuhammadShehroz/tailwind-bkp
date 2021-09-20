import ApplicationAdapter from './application';
import { toQueryString } from 'frontend/utils/url';

export default ApplicationAdapter.extend({
  urlForDeleteRecord(id, modelName, { adapterOptions }) {
    return adapterOptions
      ? `${this._super(...arguments)}?${toQueryString(adapterOptions)}`
      : this._super(...arguments);
  },

  urlForQueryRecord(query) {
    if (query.current) {
      delete query.current;
      return `${this._super(...arguments)}/current`;
    }

    return this._super(...arguments);
  }
});
