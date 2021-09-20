import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import NewRoute from 'frontend/mixins/routes/documents/new';
import FormOptions from 'frontend/mixins/routes/form-options';

export default AuthenticatedRoute.extend(NewRoute, FormOptions, {
  titleToken: 'New Estimate',
  modelName: 'estimate',

  afterModel(model) {
    if (!model.duplication) model.addLineItem();
  },

  async setupController(controller, model) {
    this._super(controller, model);
    controller.setProperties({
      fetchCountries: this.fetchCountries,
      fetchSubregions: this.fetchSubregions,
      clients: controller.clients || (await this.fetchClients()),
      currencies: controller.currencies || (await this.fetchCurrencies()),
      createTax: () => this.createTax(),
      createUnit: () => this.createUnit(),
      fetchUnits: () => this.fetchUnits()
    });
  }
});
