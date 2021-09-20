import Model, { attr } from '@ember-data/model';

export default Model.extend({
  currency: attr(),
  open: attr(),
  closed: attr(),
  draft: attr(),
  pastDue: attr()
});
