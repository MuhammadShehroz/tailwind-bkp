import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  save(message, document) {
    let documentId = document.id;
    let url = this.buildURL('comment');

    return this.ajax(url, 'POST', {
      data: {
        comment: { message },
        // eslint-disable-next-line camelcase
        document_id: documentId,
        // eslint-disable-next-line camelcase
        document_type: document.modelName
      }
    });
  }
});
