import Component from '@ember/component';
import DocumentFormComponent from 'frontend/mixins/components/document-form';
import { computed } from '@ember/object';
import { alias, reads, equal } from '@ember/object/computed';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

export default Component.extend(DocumentFormComponent, {
  elementId: 'invoice-template',

  organization: service(),
  timezones: service(),
  currentOrganization: reads('organization.current'),
  isOrganizationStripeConnected: reads('currentOrganization.isStripeConnected'),
  isOrganizationPaypalConnected: reads('currentOrganization.isPaypalConnected'),
  isOrganizationCoinbaseConnected: reads(
    'currentOrganization.isCoinbaseConnected'
  ),

  frequencyTypeLabels: service(),
  modals: service(),
  recurringPaymentTerms: reads('terms.recurringPaymentTerms'),
  contacts: A(),
  validations: alias('model.validations.attrs'),

  filteredClients: computed(
    'clients.[]',
    'model.recurringSchedules',
    'store',
    function () {
      let clients = this.clients || A();
      return clients.reject((item) =>
        this.model.recurringSchedules
          .map((schedule) => schedule.client.get('id'))
          .includes(item.id)
      );
    }
  ),

  isDailyFrequencyType: equal('model.frequencyType', 'day'),

  recurringPaymentDueDate: computed(
    'model.netTerms',
    'recurringPaymentTerms',
    'terms',
    {
      get() {
        return this.terms.findRecurringTermByType(this.model.netTerms);
      },

      set(key, netTerm) {
        let { value } = netTerm;
        this.model.set('netTerms', value);

        return netTerm;
      }
    }
  ),

  frequencyType: computed('model.frequencyType', {
    get() {
      return this.frequencyTypeLabels.findByType(this.model.frequencyType);
    },

    set(key, frequencyType) {
      this.model.set(key, frequencyType.value);
      this.model.set('frequencyQuantity', 1);

      return frequencyType;
    }
  }),

  timezoneMessage: computed('timezones.current.label', function () {
    return `Your Account timezone is ${this.timezones.current?.label}`;
  }),

  scheduleContactsFilter: (value) => (item) => {
    return value
      .map((scheduleContact) => scheduleContact.contact.get('id'))
      .includes(item.id);
  },

  addRecipient: (recurringSchedule) => (contact) => {
    let contactRecord =
      recurringSchedule.store.peekRecord('contact', contact.id) ||
      recurringSchedule.store.peekRecord('client', contact.id);
    recurringSchedule.store.createRecord('schedule-contact', {
      contact: contactRecord,
      recurringSchedule
    });
  },

  removeRecipient: (recurringSchedule) => (contact) => {
    recurringSchedule.scheduleContacts
      .find(
        (scheduleContact) =>
          scheduleContact.contact.get('id') === contact.get('contact.id')
      )
      ?.unloadRecord();
  },

  submit(event) {
    event.preventDefault();
    this.save();
  },

  actions: {
    toggleSingleSchedule() {
      if (this.model.singleSchedule) {
        this.model.recurringSchedules.forEach((recurringSchedule) => {
          recurringSchedule.set('startSendingOn', null);
        });
      } else {
        this.model.set('startSendingOn', null);
      }
    },

    preview() {
      this.modals.open('document-preview', {
        controller: 'modals.document-preview',
        document: this.model,
        message: this.model.message,
        pdfAttached: this.model.pdfAttached,
        includeStripe: this.model.includeStripe,
        includeAch: this.model.includeAch,
        includePaypal: this.model.includePaypal
      });
    },

    async selectClient(client) {
      let invoiceTemplate = this.model;
      let contacts = await this.store.query('contact', {
        client_id: client.id // eslint-disable-line camelcase
      });

      client.set('contacts', contacts);
      this.store.createRecord('recurring-schedule', {
        client,
        invoiceTemplate
      });
      this.notifyPropertyChange('clients');
    },

    removeClient(recurringSchedule) {
      let scheduleContacts = recurringSchedule.scheduleContacts.toArray();
      scheduleContacts.forEach((sc) => this.store.unloadRecord(sc));
      recurringSchedule.client.get('contacts').forEach((contact) => {
        contact.set('isSelected', false);
      });

      this.model.recurringSchedules.removeObject(recurringSchedule);
      recurringSchedule.unloadRecord();
      this.notifyPropertyChange('clients');
    },

    setStartSendingOn(recurringSchedule, value) {
      this.model.set('startSendingOn', value);
      recurringSchedule.set('startSendingOn', value);
    },

    cancel() {
      this.cancel();
    },

    onCurrencyChange(currency) {
      this.set('model.currency', currency.code);
    }
  }
});
