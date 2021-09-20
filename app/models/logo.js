import Model, { attr, belongsTo } from '@ember-data/model';
import LogoValidations from 'frontend/validations/logo';
import { reads } from '@ember/object/computed';

export default Model.extend(LogoValidations, {
  file: attr('raw'),
  organization: belongsTo(),

  size: reads('file.size')
});
