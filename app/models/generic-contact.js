import Model, { belongsTo } from '@ember-data/model';

export default class GenericContactModel extends Model {
  @belongsTo('schedule-contact') scheduleContact;
}
