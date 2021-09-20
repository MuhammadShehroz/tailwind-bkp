import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  titleToken: 'Notifications',
  queryParams: {
    page: { refreshModel: true }
  },

  model(params) {
    return this.store.query('notification', this.mergePagination(params));
  },

  actions: {
    refreshModel() {
      this.refresh();
    }
  }
});
