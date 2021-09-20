import ApplicationAdapter from './application';
import { toQueryString } from 'frontend/utils/url';

export default ApplicationAdapter.extend({
  urlForDeleteRecord(id, modelName, { adapterOptions }) {
    return adapterOptions
      ? `${this._super(...arguments)}?${toQueryString(adapterOptions)}`
      : this._super(...arguments);
  },

  urlForQueryRecord(query) {
    if (query.me) {
      delete query.me;
      return `${this._super(...arguments)}/me`;
    }

    return this._super(...arguments);
  },

  destroyAvatar() {
    let prefix = this.urlPrefix();
    let requestUrl = `${prefix}/destroy_avatar`;

    return this.ajax(requestUrl, 'POST');
  },

  confirm(token) {
    let requestUrl = `${this.host}/users/confirmation?confirmation_token=${token}`;
    return this.ajax(requestUrl, 'GET');
  }
});
