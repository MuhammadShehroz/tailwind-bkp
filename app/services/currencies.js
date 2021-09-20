import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrenciesService extends Service {
  @service store;

  @tracked all = [];

  constructor() {
    super(...arguments);
    this.loadCurrencies();
  }

  async loadCurrencies() {
    this.all = await this.store.findAll('currency');
  }

  getPropertyFor(code, prop) {
    let currency = this.all?.findBy('code', code);
    return currency?.get(prop) || code;
  }

  symbol(code) {
    return this.getPropertyFor(code, 'symbol');
  }

  name(code) {
    return this.getPropertyFor(code, 'name');
  }
}
