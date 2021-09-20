import ApplicationAdapter from './application';
import fetch from 'frontend/lib/fetch';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query) {
    if (query.me) {
      delete query.me;
      return `${this._super(...arguments)}/me`;
    }

    return this._super(...arguments);
  },

  verify(record) {
    return fetch(`${this.buildURL('custom-email-domain', record.id)}/verify`, {
      method: 'PUT',
      headers: this.headers
    });
  },

  sendTestEmail(record) {
    return fetch(
      `${this.buildURL('custom-email-domain', record.id)}/send_test`,
      {
        method: 'POST',
        headers: this.headers
      }
    );
  }
});
