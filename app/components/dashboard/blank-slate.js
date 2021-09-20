import Component from '@ember/component';
import { inject as service } from '@ember/service';

const dashboardActions = [
  {
    cardName: 'Invoices',
    description: 'Create new invoice',
    actionLink: 'invoices.new',
    color: 'bg-pink-500'
  },
  {
    cardName: 'Clients',
    description: 'Add new client',
    actionLink: 'clients.new',
    color: 'bg-yellow-500'
  },
  {
    cardName: 'Recurring Invoices',
    description: 'Start a recurring invoice',
    actionLink: 'invoice-templates.new',
    color: 'bg-green-500'
  },
  {
    cardName: 'Estimates',
    description: 'Draft new estimate',
    actionLink: 'estimates.new',
    color: 'bg-indigo-500'
  },
  {
    cardName: 'Account',
    description: 'Change settings',
    actionLink: 'account.preferences',
    color: 'bg-purple-500'
  },
  {
    cardName: 'Support',
    description: 'Chat with us',
    actionLink: 'contact-us',
    color: 'bg-green-400'
  }
];

export default Component.extend({
  router: service(),

  classNames: ['blank-slate'],

  dashboardActions
});
