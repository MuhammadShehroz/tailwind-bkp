import Mixin from '@ember/object/mixin';

export default Mixin.create({
  fetchCountries() {
    return this.store.findAll('country');
  },

  fetchSubregions(countryCode) {
    return this.store
      .findRecord('country', countryCode, { reload: true })
      .then((country) => country.get('subregions'));
  },

  fetchClients() {
    return this.store.findAll('client');
  },

  fetchCurrencies() {
    return this.store.findAll('currency');
  },

  fetchUnits() {
    return this.store.findAll('unit-of-measurement');
  },

  fetchTaxes() {
    return this.store.findAll('tax');
  }
});
