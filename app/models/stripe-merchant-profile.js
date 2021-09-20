import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  organization: belongsTo('organization'),
  code: attr(),
  email: attr(),
  stripeUserId: attr()
});
