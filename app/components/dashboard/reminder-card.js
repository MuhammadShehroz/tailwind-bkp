import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  user: service(),
  classNames: ['reminder-card'],

  currentUser: readOnly('user.current'),

  actions: {
    getSupport() {
      this._openZendesk();
    }
  },

  _openZendesk() {
    zE('webWidget', 'show');
    zE('webWidget', 'open');
  },

  _resendVerificationLink: task(function* () {
    this.flashMessages.clearMessages();
    let user = yield this.currentUser;
    yield user.resendVerification();
    this.flashMessages.success('Verification email sent.');
  }).drop()
});
