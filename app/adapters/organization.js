import ApplicationAdapter from './application';
import { toQueryString } from 'frontend/utils/url';

export default ApplicationAdapter.extend({
  urlForDeleteRecord(id, modelName, { adapterOptions }) {
    return adapterOptions
      ? `${this._super(...arguments)}?${toQueryString(adapterOptions)}`
      : this._super(...arguments);
  },

  destroyAccountLogo(id) {
    let prefix = this.urlPrefix();
    let requestUrl = `${prefix}/${id}/destroy_account_logo`;

    return this.ajax(requestUrl, 'POST');
  }
});
