import Model, { attr, hasMany } from '@ember-data/model';

export default Model.extend({
  name: attr(),
  code: attr(),
  priority: attr('number'),
  subregions: hasMany('subregion')
});
