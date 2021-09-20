import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  clients: service(),
  store: service(),
  user: service(),
  organization: service(),
  modals: service(),
  tagName: 'form',

  model: null,
  isShowingCcField: false,
  isShowingBccField: false,
  validations: alias('model.validations.attrs'),

  init() {
    this._super(...arguments);
    this.set('organizationMembers', this.store.findAll('member'));
  },

  async didReceiveAttrs() {
    await this.fetchContactsTask.perform();
    await this.fetchMembersTask.perform();
    this.document.buildDelivery({ kind: this.kind }).then((delivery) => {
      delivery.setProperties({ toRecipients: this.contacts });
      this.set('model', delivery);
    });
  },

  fetchContactsTask: task(function* () {
    let client = yield this.document.belongsTo('client').load();
    let contacts = yield this.clients.contacts(client.get('id'));

    contacts = contacts.map(({ name, email }) => ({ name, email, kind: 'to' }));

    if (client.get('email')) {
      contacts.push({
        kind: 'to',
        name: client.get('name'),
        email: client.get('email')
      });
    }

    this.set('client', client);
    this.set('contacts', contacts);
  }).drop(),

  fetchMembersTask: task(function* () {
    let members = yield this.store.findAll('member');

    members = members.map(({ name, email }) => ({
      name,
      email,
      kind: 'cc'
    }));

    if (this.user.get('email')) {
      members.unshift({
        kind: 'cc',
        name: this.user.get('name'),
        email: this.user.get('email')
      });
    }

    let org = yield this.organization.current;
    if (org.get('email')) {
      members.unshift({
        kind: 'cc',
        name: org.get('name'),
        email: org.get('email')
      });
    }

    this.set('members', members);
  }).drop(),

  willDestroy() {
    this.rollbackDelivery();
  },

  rollbackDelivery() {
    let { model } = this;

    if (model) {
      model.rollbackAttributes();
      this.set('model', null);
    }
  },

  actions: {
    preview() {
      this.modals.open('document-preview', {
        controller: 'modals.document-preview',
        document: this.document,
        message: this.model.message,
        pdfAttached: this.model.pdfAttached,
        includeStripe: this.model.includeStripe,
        includeAch: this.model.includeAch,
        includePaypal: this.model.includePaypal
      });
    },

    cancel() {
      this.cancel();
    },

    send() {
      let { model } = this;
      this.set('validationsEnabled', true);

      model.validate().then(({ validations }) => {
        if (validations.isValid) {
          this.accept(model, this.kind);
        }
      });
    },

    toggleCcField() {
      this.toggleProperty('isShowingCcField');
    },

    toggleBccField() {
      this.toggleProperty('isShowingBccField');
    }
  }
});
