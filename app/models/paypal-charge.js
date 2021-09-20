import Model, { attr } from '@ember-data/model';

export default Model.extend({
  invoice_id: attr(), // eslint-disable-line camelcase
  amount: attr(),
  ppOrderId: attr(),
  paypalChargeId: attr(),
  payerId: attr(),
  status: attr()
});
