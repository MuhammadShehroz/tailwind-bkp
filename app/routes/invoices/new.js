import { isPresent } from '@ember/utils';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import NewRoute from 'frontend/mixins/routes/documents/new';
import FormOptions from 'frontend/mixins/routes/form-options';
import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend(NewRoute, FormOptions, {
  titleToken: 'New Invoice',
  modelName: 'invoice',
  organization: service(),
  currentOrganization: reads('organization.current'),

  model(params) {
    let clientID = params.client;
    let sourceType = params.source_type;
    let sourceID = params.source_id;

    if (isPresent(clientID)) {
      return this.store.findRecord('client', clientID).then((client) => {
        return this.defaultDocumentAttributes(client).then((defaults) => {
          return this.store.createRecord(this.modelName, defaults).buildNew();
        });
      });
    }

    return this.defaultDocumentAttributes().then((defaults) => {
      if (isPresent(sourceID)) {
        return this.store.find(sourceType, sourceID).then((source) => {
          return this.store
            .createRecord(this.modelName, defaults)
            .duplicate(source);
        });
      }

      return this.store.createRecord(this.modelName, defaults).buildNew();
    });
  },

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
