import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  title: 'Edit Contact',

  model(params) {
    return this.store.findRecord('contact', params.contact_id);
  },

  deactivate() {
    this.modelFor(this.routeName).rollbackAttributes();
  }
});
