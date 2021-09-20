import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQuery() {
    return `${this.host}/api/invitations`;
  },

  async resendInvitation(store, type, id) {
    let url = `${this.buildURL(type, id)}/resend`;
    let data = await this.ajax(url, 'PUT');
    store.pushPayload(type, data);
  },

  accept(id) {
    let url = `${this.host}/api/invitations/${id}/accept`;
    return this.ajax(url, 'PUT');
  },

  decline(id) {
    let url = `${this.host}/api/invitations/${id}/decline`;
    return this.ajax(url, 'PUT');
  }
});
