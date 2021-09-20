import Component from '@ember/component';
import { computed } from '@ember/object';
import { capitalize } from '@ember/string';
import { inject as service } from '@ember/service';
import { reads, equal, and, or } from '@ember/object/computed';

export default Component.extend({
  classNames: ['send-document'],

  organization: service(),
  currentOrganization: reads('organization.current'),
  isOrganizationStripeConnected: reads('currentOrganization.isStripeConnected'),
  isOrganizationCoinbaseConnected: reads(
    'currentOrganization.isCoinbaseConnected'
  ),

  isOrganizationPaypalConnected: reads('currentOrganization.isPaypalConnected'),
  hasPaymentProcessorConnected: or(
    'isOrganizationStripeConnected',
    'isOrganizationPaypalConnected'
  ),

  isSendInvoice: equal('document.modelName', 'invoice'),
  showPaymentOptions: and('isSendInvoice', 'hasPaymentProcessorConnected'),

  title: computed('document.modelName', 'kind', function () {
    if (this.kind === 'reminder') {
      return 'Send Reminder';
    } else {
      return `Send ${capitalize(this.document.modelName)}`;
    }
  })
});
