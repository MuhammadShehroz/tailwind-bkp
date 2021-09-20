import Model, { belongsTo } from '@ember-data/model';
import LineItem from 'frontend/mixins/models/line-item';
import { alias, reads } from '@ember/object/computed';

export default Model.extend(LineItem, {
  invoice: belongsTo(),
  document: alias('invoice'),
  validationsEnabled: reads('invoice.validationsEnabled')
});
