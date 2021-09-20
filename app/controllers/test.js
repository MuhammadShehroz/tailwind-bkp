import Controller from '@ember/controller';

const currencies = [
  { id: 'eur', name: 'Euro' },
  { id: 'usd', name: 'USA Dollar' },
  { id: 'cad', name: 'Canadian Dollar' },
  { id: 'gbp', name: 'Great Britain Pound' },
  { id: 'sfr', name: 'Swiss Franc' }
];

export default Controller.extend({
  currencies,

  sum: 77.34,

  actions: {
    onTrailingIconClick() {}
  },

  init() {
    this._super();
    this.set('currency', this.currencies.findBy('id', 'gbp'));
    this.set('currencyId', 'cad');
  }
});
