import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import FormOptions from 'frontend/mixins/routes/form-options';

export default AuthenticatedRoute.extend(FormOptions, {
  titleToken: 'Client Preferences',

  model(params) {
    return this.store.find('client', params.client_id);
  },

  createTax() {
    return this.store.createRecord('tax');
  },

  createUnit() {
    return this.store.createRecord('unit-of-measurement');
  },

  async setupController(controller, model) {
    this._super(controller, model);
    controller.setProperties({
      currencies: controller.currencies || (await this.fetchCurrencies()),
      taxes: controller.taxes || (await this.fetchTaxes()),
      units: controller.units || (await this.fetchUnits()),
      createTax: () => this.createTax(),
      createUnit: () => this.createUnit()
    });
  },

  deactivate() {
    this.modelFor(this.routeName).rollbackAttributes();
  }
});
