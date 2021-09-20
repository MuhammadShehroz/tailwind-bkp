import Model, { attr, hasMany } from '@ember-data/model';
import EmailDomainValidations from 'frontend/validations/custom-email-domain';

export default class CustomEmailDomainModel extends Model.extend(
  EmailDomainValidations
) {
  @attr('string', { defaultValue: '' }) email;

  @attr('string', { defaultValue: '' }) domain;

  @attr('string') status;

  @hasMany('dns-record') dnsRecords;

  get isVerified() {
    return this.status === 'active';
  }
}
