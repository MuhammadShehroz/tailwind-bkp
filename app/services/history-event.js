import Service, { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  query(document) {
    return this.store.query('history-event', {
      document_id: document.id, // eslint-disable-line camelcase
      document_type: document.modelName // eslint-disable-line camelcase
    });
  }
});
