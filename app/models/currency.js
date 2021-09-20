import Model, { attr } from '@ember-data/model';

export default Model.extend({
  code: attr(),
  name: attr(),
  symbol: attr()
});
