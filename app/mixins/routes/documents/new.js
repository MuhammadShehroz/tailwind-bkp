import Mixin from '@ember/object/mixin';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Mixin.create({
  queryParams: {
    client: { refreshModel: true }
  },

  titleToken: null,
  modelName: null,

  organization: service(),
  currentOrganization: reads('organization.current'),

  defaultDocumentAttributes(client = null) {
    return this.currentOrganization.get('tax').then((organizationTax) => {
      let activeOrganizationTax =
        organizationTax && organizationTax.active ? organizationTax : null;

      if (client) {
        return client.tax.then((clientTax) => {
          let activeClientTax =
            clientTax && clientTax.active ? clientTax : null;

          return {
            client,
            taxDistribution: client.get('taxDistribution'),
            tax: activeClientTax || activeOrganizationTax
          };
        });
      } else {
        return {
          taxDistribution: this.currentOrganization.get('taxDistribution'),
          tax: activeOrganizationTax
        };
      }
    });
  },

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

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.setProperties({
        client: null,
        // eslint-disable-next-line camelcase
        source_type: null,
        // eslint-disable-next-line camelcase
        source_id: null
      });
    }
  },

  deactivate() {
    this.modelFor(this.routeName).rollbackAttributes();
  },

  createTax() {
    return this.store.createRecord('tax');
  },

  fetchUnits() {
    return this.store.findAll('unit-of-measurement');
  }
});
