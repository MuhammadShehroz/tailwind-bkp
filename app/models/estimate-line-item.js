import Model, { belongsTo } from '@ember-data/model';
import LineItem from 'frontend/mixins/models/line-item';
import { alias, reads } from '@ember/object/computed';

export default Model.extend(LineItem, {
  estimate: belongsTo(),
  document: alias('estimate'),
  validationsEnabled: reads('estimate.validationsEnabled')
});
