import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import FormOptions from 'frontend/mixins/routes/form-options';

export default AuthenticatedRoute.extend(FormOptions, {
  titleToken: 'Edit Client',

  model(params) {
    return this.store.find('client', params.client_id);
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

  setupController(controller, model) {
    model.buildDependencies();
    controller.flashMessages.clearMessages();
    controller.set('countries', this.countries.sortBy('priority'));
    controller.set('subregions', this.subregions);
    controller.set('fetchSubregions', this.fetchSubregions);
    this._super(controller, model);
  },

  deactivate() {
    this.modelFor(this.routeName).rollbackAttributes();
  }
});
