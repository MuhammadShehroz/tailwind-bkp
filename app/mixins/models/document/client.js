import Mixin from '@ember/object/mixin';
import { PromiseObject } from '@ember-data/store/-private';
import { belongsTo, attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import { assign } from '@ember/polyfills';

export default Mixin.create({
  clientAccessToken: attr(),
  client: belongsTo('client', { async: true }),
  unitPrice: or('client.unitPrice', 'currentOrganization.unitPrice'),
  unitOfMeasurement: computed(
    'client.unitOfMeasurement',
    'currentOrganization.unitOfMeasurement',
    function () {
      return this.client.then((client) => {
        if (client) {
          return this.client
            .get('unitOfMeasurement')
            .then((clientDefaultUnit) => {
              if (clientDefaultUnit) {
                return clientDefaultUnit;
              }

              return this.currentOrganization.get('unitOfMeasurement');
            });
        }

        return this.currentOrganization.get('unitOfMeasurement');
      });
    }
  ),

  pdfAttached: computed(
    'client.pdfAttached',
    'currentOrganization.pdfAttached',
    function () {
      if (
        this.client.get('pdfAttached') ||
        this.client.get('pdfAttached') === false
      ) {
        return this.client.get('pdfAttached');
      }

      return this.currentOrganization.get('pdfAttached');
    }
  ),

  newWithDefaults(options) {
    let params = assign(
      {
        // eslint-disable-next-line camelcase
        client_id: this.client.get('id')
      },
      options
    );

    return PromiseObject.create({
      promise: this.newDefaults(params)
    });
  }
});
