import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import FormOptions from 'frontend/mixins/routes/form-options';

export default AuthenticatedRoute.extend(FormOptions, {
  titleToken: 'Saved Items',

  model() {
    return this.store.findAll('saved-item');
  },

  addItem() {
    return this.store.createRecord('saved-item', {
      // currency: org.currency
    });
  },

  async setupController(controller, model) {
    this._super(controller, model);
    controller.setProperties({
      addItem: this.addItem,
      units:
        controller.units || (await this.store.findAll('unit-of-measurement')),

      currencies: controller.currencies || this.fetchCurrencies()
    });
  }
});
