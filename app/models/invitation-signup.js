import Model, { attr } from '@ember-data/model';
import { collectionAction } from 'frontend/lib/restless-methods';
import { inject as service } from '@ember/service';
import InvitationSignupValidations from 'frontend/validations/invitation-signup';

export default Model.extend(InvitationSignupValidations, {
  firstName: attr(),
  lastName: attr(),
  email: attr(),
  password: attr(),

  ajax: service(),

  newDefaults: collectionAction('new', { method: 'get' }),

  buildNew(token) {
    return this.newDefaults({ token }).then((data) => {
      let newAttrs = this.store.normalize(
        'invitation_signup',
        data.invitation_signup
      ).data.attributes;

      this.setProperties(newAttrs);

      return this;
    });
  }
});
