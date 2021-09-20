import Model, { attr } from '@ember-data/model';

export default Model.extend({
  amount: attr(),
  hosted_url: attr(), // eslint-disable-line camelcase
  invoice_id: attr(), // eslint-disable-line camelcase
  status: attr(),
  kind: attr()
});
