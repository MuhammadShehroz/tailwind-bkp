import Model, { belongsTo } from '@ember-data/model';

export default Model.extend({
  convertedTo: belongsTo('invoice')
});
