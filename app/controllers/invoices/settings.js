import Controller from '@ember/controller';
import { readOnly } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Controller.extend({
  billingAddress: readOnly('model.billingAddress'),

  validationsEnabled: false,
  showMobileNav: false,

  removeAvatar() {
    let adapter = this.store.adapterFor('organization');
    return adapter.destroyAccountLogo(this.model.id);
  },

  actions: {
    cancel() {
      this.transitionToRoute('index');
    },

    handleShowMobileNav() {
      this.set('showMobileNav', !this.showMobileNav);
    }
  },

  _saveModelTask: task(function* () {
    this.set('validationsEnabled', true);
    let { validations } = yield this.model.validate();
    if (validations.isValid) {
      yield this.model.save();
      this.flashMessages.success('Profile saved.');
      this.set('validationsEnabled', false);
    }
  }).drop()
});
