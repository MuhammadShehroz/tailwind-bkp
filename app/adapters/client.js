import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  archive(id) {
    let url = `${this.buildURL('client', id)}/archive`;
    return this.ajax(url, 'PUT');
  },

  unarchive(id) {
    let url = `${this.buildURL('client', id)}/unarchive`;
    return this.ajax(url, 'PUT');
  }
});
