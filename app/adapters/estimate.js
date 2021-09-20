import ApplicationAdapter from './application';
import underscoreQuery from 'frontend/utils/underscore-query';

export default ApplicationAdapter.extend({
  approve(id) {
    let url = `${this.buildURL('estimate', id)}/approve`;
    return this.ajax(url, 'PUT');
  },

  decline(id) {
    let url = `${this.buildURL('estimate', id)}/decline`;
    return this.ajax(url, 'PUT');
  },

  query(store, type, query) {
    let url = this.buildURL('estimate');
    let preparedQuery = underscoreQuery(query);
    return this.ajax(url, 'GET', { data: preparedQuery });
  }
});
