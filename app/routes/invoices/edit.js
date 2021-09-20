import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import EditRoute from 'frontend/mixins/routes/documents/edit';
import FormOptions from 'frontend/mixins/routes/form-options';

export default AuthenticatedRoute.extend(EditRoute, FormOptions, {
  titleToken: 'Edit Invoice',
  modelName: 'invoice',

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
