import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import FormOptions from 'frontend/mixins/routes/form-options';

export default AuthenticatedRoute.extend(FormOptions, {
  organization: service(),

  model() {
    return this.organization.current;
  },

  createLogo() {
    return this.store.createRecord('logo');
  },

  removeLogo(id) {
    let adapter = this.store.adapterFor('organization');
    return adapter.destroyAccountLogo(id);
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
    model.buildBillingAddress();
    controller.setProperties({
      logo: this.createLogo(),
      countries: this.countries.sortBy('priority'),
      subregions: this.subregions,
      fetchSubregions: this.fetchSubregions,
      removeLogo: (id) => this.removeLogo(id)
    });
    this._super(controller, model);
  },

  deactivate() {
    this.modelFor(this.routeName).rollbackAttributes();
  }
});
