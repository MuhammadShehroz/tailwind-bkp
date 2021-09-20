import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { readOnly } from '@ember/object/computed';
import { validator, buildValidations } from 'ember-cp-validations';
import { computed } from '@ember/object';
import { A } from '@ember/array';

const Validations = buildValidations({
  startSendingOn: validator('presence', {
    presence: true,
    disabled: readOnly('model.invoiceTemplate.singleSchedule'),
    dependentKeys: ['model.invoiceTemplate.singleSchedule']
  })
});

export default class RecurringScheduleModel extends Model.extend(Validations) {
  @attr('date') startSendingOn;

  @belongsTo('client', { async: true }) client;

  @belongsTo('invoice-template', { async: true }) invoiceTemplate;

  @hasMany('schedule-contact', { async: false }) scheduleContacts;

  @computed('client', 'client.contacts.[]')
  get contactOptions() {
    let contactOptions = A();
    if (this.client.get('email')) {
      contactOptions.pushObject({
        id: this.client.get('id'),
        email: this.client.get('email'),
        name: this.client.get('name'),
        client: this.client
      });
    }

    this.client.get('contacts').forEach((contact) => {
      contactOptions.pushObject({
        id: contact.get('id'),
        email: contact.get('email'),
        name: contact.get('name'),
        client: this.client,
        contact: this.client
      });
    });
    return contactOptions;
  }
}
