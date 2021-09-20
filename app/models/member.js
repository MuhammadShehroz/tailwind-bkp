import Model, { attr } from '@ember-data/model';

export default Model.extend({
  email: attr(),
  name: attr(),
  permissions: attr({ defaultValue: 'member' })
});
