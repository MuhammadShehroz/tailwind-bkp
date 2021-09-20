import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  titleToken: 'Recurring Invoice Templates',
  modelName: 'invoice_template',

  queryParams: {
    name: {
      refreshModel: true
    },

    sort: {
      refreshModel: true
    },

    order: {
      refreshModel: true
    },

    page: {
      refreshModel: true
    }
  },

  model(params) {
    return this.store.query(this.modelName, this.mergePagination(params));
  }
});
