import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord({ organizationId }) {
    if (organizationId) {
      return `${this.buildURL()}/${organizationId}/document_count_stats`;
    }

    return this._super(...arguments);
  }
});
