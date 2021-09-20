import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import FormOptions from 'frontend/mixins/routes/form-options';

export default AuthenticatedRoute.extend(FormOptions, {
  titleToken: 'New Client',

  model() {
    return this.store.createRecord('client');
  },

  async beforeModel() {
    this.set('countries', await this.fetchCountries());
  },

  async afterModel(model) {
    await model.buildDependencies();
    let country = model.billingAddress?.country;
    if (country) {
      this.set('subregions', await this.fetchSubregions(country));
    }
  },

  setupController(controller, model) {
    model.buildBillingAddress().addContact();
    controller.set('countries', this.countries.sortBy('priority'));
    controller.set('subregions', this.subregions);
    controller.set('fetchSubregions', this.fetchSubregions);
    this._super(controller, model);
  },

  deactivate() {
    this.modelFor(this.routeName).rollbackAttributes();
  }
});
