import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import ClientList from 'frontend/utils/filter/client-list';

export default AuthenticatedRoute.extend({
  titleToken: 'Invoices',
  modelName: 'invoice',

  queryParams: {
    name: {
      refreshModel: true
    },

    id: {
      refreshModel: true
    },

    prefix: {
      refreshModel: true
    },

    // eslint-disable-next-line camelcase
    client_id: {
      refreshModel: true
    },

    status: {
      refreshModel: true
    },

    before: {
      refreshModel: true
    },

    after: {
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

  fetchClients() {
    return this.store.findAll('client');
  },

  model(params) {
    return this.store.query(this.modelName, this.mergePagination(params));
  },

  async setupController(controller, model) {
    this._super(controller, model);
    if (controller.filter.clients.length === 0) {
      let clients = await this.fetchClients();
      controller.set(
        'filter.clients',
        ClientList.create({ clients: clients.toArray() }).clients
      );
      controller.set('filter.clientId', controller.clientId);
      controller.set('filter.status', controller.status);
      controller.set('filter.dateRange', controller.dateRange);
    }
  }
});
