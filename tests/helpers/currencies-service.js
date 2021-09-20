import EmberObject from '@ember/object';
import CurrenciesService from 'frontend/services/currencies';

export default function (values) {
  return class CurrenciesServiceStub extends CurrenciesService {
    loadCurrencies() {
      this.all = values.map((value) => EmberObject.create(value));
    }
  };
}
