import Model, { attr } from '@ember-data/model';

export default Model.extend({
  amount: attr(),
  intent_secret: attr(), // eslint-disable-line camelcase
  invoice_id: attr(), // eslint-disable-line camelcase
  status: attr(),
  kind: attr(),

  sync() {
    let adapter = this.store.adapterFor('charge');
    return adapter.sync(this.id);
  }
});
