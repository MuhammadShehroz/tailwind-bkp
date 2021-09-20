import Model, { attr } from '@ember-data/model';
import { buildValidations } from 'ember-cp-validations';

let Validations = buildValidations();

export default Model.extend(Validations, {
  identifier: attr(),
  memberId: attr('number'),
  organizationId: attr('number'),
  role: attr(),
  unreadNotificationsCount: attr('number'),
  commentNotifications: attr(),
  documentDeliveryNotifications: attr(),
  estimateStatusNotifications: attr(),
  paymentNotifications: attr(),
  createdAt: attr('date')
});
