import Model, { attr, belongsTo } from '@ember-data/model';

export default class DNSRecordModel extends Model {
  @attr('string') name;

  @attr('string') value;

  @attr('string') type;

  @attr('number') priority;

  @attr('string') valid;

  @attr('boolean') isMxRecord;

  @belongsTo('custom-email-domain') customEmailDomain;

  get label() {
    return this.isMxRecord
      ? this.name || this.customEmailDomain.get('domain')
      : this.name;
  }
}
