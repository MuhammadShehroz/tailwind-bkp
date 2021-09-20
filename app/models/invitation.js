import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias, equal, not } from '@ember/object/computed';
import InvitationValidations from 'frontend/validations/invitation';
import { capitalize } from '@ember/string';

export default Model.extend(InvitationValidations, {
  email: attr('string', { defaultValue: '' }),
  permissions: attr({ defaultValue: 'member' }),
  organizationName: attr(),
  status: attr(),
  valid: attr('boolean'),
  invitedAt: attr('date'),

  user: belongsTo(),
  organization: belongsTo(),

  isInvalid: not('valid'),
  isPending: equal('status', 'pending'),
  isDeclined: equal('status', 'declined'),
  isExpired: alias('isInvalid'),

  warningStatusLabel: computed(
    'isDeclined',
    'isExpired',
    'status',
    function () {
      if (this.isExpired) {
        return 'Expired';
      }

      if (this.isDeclined) {
        return capitalize(this.status);
      }

      return null;
    }
  ),

  async resendInvitation() {
    let { modelName } = this.constructor;

    let adapter = this.store.adapterFor(modelName);
    await adapter.resendInvitation(this.store, modelName, this.id);
  },

  accept() {
    let adapter = this.store.adapterFor(this.constructor.modelName);
    return adapter.accept(this.id);
  },

  decline() {
    let adapter = this.store.adapterFor(this.constructor.modelName);
    return adapter.decline(this.id);
  }
});
