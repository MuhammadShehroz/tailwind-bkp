import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  query: function query(store, type, query) {
    let url = `${this.buildURL('client', query.clientId)}/amount_stats`;
    return this.ajax(url, 'GET');
  }
});
