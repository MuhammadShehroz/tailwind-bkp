import EmberObject, { computed } from '@ember/object';
import { resolve } from 'rsvp';
import Tax from 'frontend/services/tax';

export default function (values) {
  return Tax.extend({
    existingTaxes: computed(function () {
      return resolve(values.map((value) => EmberObject.create(value)));
    })
  });
}
