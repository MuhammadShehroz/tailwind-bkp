import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import FormOptions from 'frontend/mixins/routes/form-options';
import { all } from 'rsvp';

export default AuthenticatedRoute.extend(FormOptions, {
  titleToken: 'New Organization',
  layout: 'accounts-hub',

  model() {
    return this.store.createRecord('organization');
  },

  async setupController(controller, model) {
    model.buildBillingAddress();
    this._super(controller, model);
    controller.setProperties({
      countries: controller.countries || (await this.fetchCountries()),
      currencies: controller.currencies || (await this.fetchCurrencies())
    });
  },

  _loadUserAndOrganization() {
    return all([this.user.current.catch(() => this.session.invalidate())]);
  }
});
