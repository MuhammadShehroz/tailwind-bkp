import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  country: belongsTo(),
  name: attr(),
  code: attr()
});
