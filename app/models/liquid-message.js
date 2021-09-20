import Model, { attr } from '@ember-data/model';

export default Model.extend({
  preview: attr(),
  includeConditionals: attr()
});
