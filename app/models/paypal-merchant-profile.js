import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  organization: belongsTo('organization'),
  code: attr('string'),
  email: attr('string'),
  temporaryCode: attr('string'),
  loginUrl: attr('string')
});
