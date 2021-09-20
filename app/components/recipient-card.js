import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  recipientCountry: readOnly('model.billingAddress.country'),

  country: computed(
    'model.billingAddress.country',
    'recipientCountry',
    function () {
      if (this.recipientCountry) {
        return this.store.find('country', this.recipientCountry);
      }

      return null;
    }
  ).readOnly()
});
