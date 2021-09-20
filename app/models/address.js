import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { notEmpty, or } from '@ember/object/computed';

export default Model.extend({
  address1: attr(),
  address2: attr(),
  city: attr(),
  subregion: attr(),
  country: attr({ defaultValue: 'US' }),
  zip: attr(),

  address1Present: notEmpty('address1'),
  address2Present: notEmpty('address2'),
  oneAddressPresent: or('address1Present', 'address2Present'),
  cityPresent: notEmpty('city'),
  countryPresent: notEmpty('country'),

  short: computed(
    'address1',
    'address2',
    'city',
    'cityPresent',
    'country',
    'countryPresent',
    'oneAddressPresent',
    'subregion',
    'zip',
    function () {
      let address = [];

      if (this.oneAddressPresent) {
        address.push(`${this.address1 || ''} ${this.address2 || ''}`.trim());
      }

      if (this.cityPresent) {
        address.push(this.city);
      }

      let zipAndSubregion = `${this.subregion || ''} ${this.zip || ''}`.trim();

      if (isPresent(zipAndSubregion)) {
        address.push(zipAndSubregion);
      }

      if (this.countryPresent) {
        address.push(this.country);
      }

      return address.compact().join(', ').trim();
    }
  )
});
