import Model, { attr, belongsTo } from '@ember-data/model';
import AvatarValidations from 'frontend/validations/avatar';
import { reads } from '@ember/object/computed';

export default Model.extend(AvatarValidations, {
  file: attr('raw'),
  user: belongsTo(),

  size: reads('file.size')
});
