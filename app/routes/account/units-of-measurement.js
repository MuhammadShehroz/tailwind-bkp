import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  titleToken: 'Units of Measurements',

  model() {
    return this.store.findAll('unit-of-measurement');
  },

  addUnit() {
    return this.store.createRecord('unit-of-measurement');
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('addUnit', this.addUnit);
  }
});
