import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  titleToken: 'New Contact',

  model(params) {
    return this.store.findRecord('client', params.client_id);
  },

  setupController(controller, client) {
    let model = this.store.createRecord('contact', { client });
    controller.flashMessages.clearMessages();
    this._super(controller, model);
  },

  deactivate() {
    this.modelFor(this.routeName).rollbackAttributes();
  }
});
