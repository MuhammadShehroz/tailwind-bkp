import Model, { belongsTo } from '@ember-data/model';
import LineItem from 'frontend/mixins/models/line-item';
import { alias, reads } from '@ember/object/computed';

export default Model.extend(LineItem, {
  invoiceTemplate: belongsTo(),
  document: alias('invoiceTemplate'),
  validationsEnabled: reads('invoiceTemplate.validationsEnabled')
});
