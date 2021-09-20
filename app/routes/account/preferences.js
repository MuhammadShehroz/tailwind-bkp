import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import FormOptions from 'frontend/mixins/routes/form-options';

export default AuthenticatedRoute.extend(FormOptions, {
  organization: service(),
  titleToken: 'Preferences',

  model() {
    return this.organization.current;
  },

  addTax() {
    return this.store.createRecord('tax');
  },

  async beforeModel() {
    this.set('countries', await this.fetchCountries());
  },

  async afterModel(model) {
    let country = model.billingAddress?.country;
    if (country) {
      this.set('subregions', await this.fetchSubregions(country));
    }
  },

  async setupController(controller, model) {
    this._super(controller, model);
    controller.setProperties({
      addTax: this.addTax,
      subregions: this.subregions,
      fetchCountries: this.fetchCountries,
      fetchSubregions: this.fetchSubregions,
      units: controller.units || (await this.fetchUnits()),
      taxes: controller.taxes || (await this.fetchTaxes()),
      currencies: controller.currencies || (await this.fetchCurrencies()),
      countries: controller.countries || this.countries.sortBy('priority')
    });
  }
});
