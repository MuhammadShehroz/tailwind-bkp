import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  sync(id) {
    let url = `${this.buildURL('charge', id)}/sync`;
    return this.ajax(url, 'PUT');
  }
});
