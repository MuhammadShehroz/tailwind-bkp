import Model, { belongsTo } from '@ember-data/model';

export default class ScheduleContactModel extends Model {
  @belongsTo('generic-contact', { polymorphic: true, async: true }) contact;

  @belongsTo('recurring-schedule', { async: true }) recurringSchedule;
}
