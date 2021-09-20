import Model, { attr } from '@ember-data/model';

export default Model.extend({
  organizationMembershipId: attr(),
  medium: attr(),
  readAt: attr(),
  createdAt: attr(),
  message: attr(),
  subjectId: attr(),
  subjectRoute: attr(),
  subjectType: attr()
});
