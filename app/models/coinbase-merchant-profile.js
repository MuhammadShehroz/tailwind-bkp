import Model, { attr, belongsTo } from '@ember-data/model';
import CoinbaseMerchantProfileValidations from 'frontend/validations/coinbase-merchant-profile';

export default Model.extend(CoinbaseMerchantProfileValidations, {
  organization: belongsTo('organization'),
  apiKey: attr(),
  coinbaseWebhookSecret: attr()
});
