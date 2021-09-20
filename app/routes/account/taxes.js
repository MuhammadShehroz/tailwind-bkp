import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  titleToken: 'Taxes',

  model() {
    return this.store.findAll('tax');
  },

  addTax() {
    return this.store.createRecord('tax');
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('addTax', this.addTax);
  }
});
