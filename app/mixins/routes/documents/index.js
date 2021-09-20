import Mixin from '@ember/object/mixin';
import documentsQueryParams from 'frontend/mixins/routes/documents-query-params';

export default Mixin.create(documentsQueryParams({ filterByClient: true }), {
  titleToken: null,
  modelName: null,

  model(params) {
    return this.store.query(this.modelName, this.mergePagination(params));
  }
});
