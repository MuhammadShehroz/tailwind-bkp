import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { capitalize, htmlSafe } from '@ember/string';
import { action } from '@ember/object';
import { next } from '@ember/runloop';
import { scrollToErrorField } from 'frontend/utils/scroller';
import { pluralize } from 'ember-inflector';
import ValidationError from 'frontend/utils/errors/validation-error';
import InvalidError from 'frontend/utils/errors/invalid-error';

export default class DocumentPreviewComponent extends Component {
  @service user;

  @service store;

  @service router;

  @service clients;

  @service modals;

  @service loader;

  @service storage;

  @service organization;

  @service flashMessages;

  @service windowMessage;

  @tracked client;

  @tracked delivery;

  @tracked members;

  @tracked contacts;

  @tracked contactSelectPublicAPI;

  @tracked isEditingTemplate = false;

  @tracked isShowingCcField = false;

  @tracked isShowingBccField = false;

  @tracked isShowingPreveiw = true;

  @tracked addLogoAvatar;

  rootElement = null;

  documentPreviewElement = null;

  addLogoListenerUnregister = null;

  changeHeaderColorListenerUnregister = null;

  changeHeaderColorListenerUnregister = null;

  get kind() {
    return this.args.kind || 'send';
  }

  get backRoute() {
    return this.args.backRoute;
  }

  get modelName() {
    return this.args.model.modelName;
  }

  get editRoute() {
    return `${pluralize(this.modelName)}.edit`;
  }

  get currentOrg() {
    return this.organization.current;
  }

  get isOrganizationStripeConnected() {
    return this.currentOrg?.get('isStripeConnected');
  }

  get isOrganizationCoinbaseConnected() {
    return this.currentOrg?.get('isCoinbaseConnected');
  }

  get isOrganizationPaypalConnected() {
    return this.currentOrg?.get('isPaypalConnected');
  }

  get canAddContact() {
    return this.client?.kind === 'company';
  }

  get hasOrgPaymentMethods() {
    return (
      this.isOrganizationPaypalConnected ||
      this.isOrganizationStripeConnected ||
      this.isOrganizationCoinbaseConnected
    );
  }

  constructor() {
    super(...arguments);
    this.setup();
    this.setupListeners();
  }

  willDestroy() {
    this.addLogoListenerUnregister();
    this.changeHeaderColorListenerUnregister();
    this.changeAccentColorListenerUnregister();
    this.activatePaymentsListenerUnregister();
    super.willDestroy(...arguments);
  }

  async setup() {
    await this.fetchContactsTask.perform();
    await this.fetchMembersTask.perform();
    this.buildDelivery();
  }

  setupListeners() {
    let reload = this.reloadPreview.bind(this);
    let didAddLogo = (avatar) => {
      this.addLogoAvatar = avatar;
      reload();
    };

    this.addLogoListenerUnregister = this.windowMessage.registerListener(
      async () =>
        this.modals.open('document-branding/add-logo', {
          logo: this.args.logo,
          model: await this.organization.current,
          controller: 'modals.document-branding.add-logo',
          onSave: didAddLogo,
          removeLogo: this.args.removeLogo
        }),
      'add-logo'
    );

    this.changeHeaderColorListenerUnregister =
      this.windowMessage.registerListener(
        async () =>
          this.modals.open('document-branding/add-header-color', {
            model: await this.organization.current,
            logoUrl: this.addLogoAvatar?.file?.data,
            controller: 'modals.document-branding.add-header-color',
            onSave: reload
          }),
        'change-header-color'
      );

    this.changeAccentColorListenerUnregister =
      this.windowMessage.registerListener(
        async () =>
          this.modals.open('document-branding/add-accent-color', {
            model: await this.organization.current,
            logoUrl: this.addLogoAvatar?.file?.data,
            controller: 'modals.document-branding.add-accent-color',
            onSave: reload
          }),
        'change-accent-color'
      );

    this.activatePaymentsListenerUnregister =
      this.windowMessage.registerListener(() => {
        this.redirectToPaymentMethods();
      }, 'activate-payments');
  }

  redirectToPaymentMethods() {
    let route = 'account.payment-methods';
    this.storage.setSessionItem('redirectURL', route, this.router.currentURL);
    this.router.transitionTo(route);
  }

  async buildDelivery() {
    let delivery = await this.args.model.buildDelivery({ kind: this.kind });
    delivery.message =
      delivery.message ||
      this.currentOrg?.get(`${this.modelName}Message`) ||
      '';
    delivery.toRecipients = this.contacts.map((val) => val);
    this.delivery = delivery;
  }

  toggleEditTemplate(value) {
    this.isEditingTemplate = value;
    this.windowMessage.postMessage(
      JSON.stringify({ type: 'edit-template', data: { edit: value } }),
      this.documentPreviewElement?.querySelector('iframe')?.contentWindow
        .origin,
      this.documentPreviewElement?.querySelector('iframe')?.contentWindow
    );
  }

  reloadPreview() {
    // Force the preview to re-render
    this.isShowingPreveiw = false;
    next(() => (this.isShowingPreveiw = true));
  }

  @action
  didLoadPreview() {
    this.toggleEditTemplate(this.isEditingTemplate);
  }

  @action
  cancelEditTemplate() {
    this.toggleEditTemplate(false);
  }

  @action
  editTemplate(value) {
    this.toggleEditTemplate(value);
  }

  @action
  editMessage() {
    this.modals.open('edit-message', {
      message: this.delivery.message,
      onAccept: (message) => (this.delivery.message = message)
    });
  }

  @action
  addContact() {
    let contact = this.store.createRecord('contact', { client: this.client });
    this.contactSelectPublicAPI.actions.close();
    this.modals.open('add-edit-contact', {
      contact,
      onCancel: () => contact.unloadRecord(),
      onSave: (contact) => {
        this.contacts = [...this.contacts, contact];
        this.delivery.toRecipients = [...this.delivery.toRecipients, contact];
      }
    });
  }

  @action
  activatePayments() {
    this.redirectToPaymentMethods();
  }

  @action
  back() {
    this.router.transitionTo(this.backRoute, this.args.model);
  }

  @action
  edit() {
    this.router.transitionTo(this.editRoute, this.args.model);
  }

  @(task(function* () {
    let adapter = this.store.adapterFor('organization');
    let org = yield this.currentOrg;
    yield adapter.destroyAccountLogo(org.id);

    org.set('headerColor', '#354656');
    org.set('buttonColor', '#1173E6');
    org.set('buttonLabelColor', '#ffffff');
    org.set('buttonHoverColor', '#1590ec');
    yield org.save();
    this.addLogoAvatar = null;
    this.reloadPreview();
  }).drop())
  resetEditTemplateTask;

  @(task(function* () {
    this.loader.startLoading();
    this.delivery.set('validationsEnabled', true);
    yield this.delivery
      .validate()
      .then(() => {
        if (this.delivery.validations.isValid) {
          return Promise.resolve(this.delivery);
        } else {
          scrollToErrorField();
          return Promise.reject(this.delivery.validations.errors);
        }
      })
      .then(
        () =>
          this.delivery.save().catch((error) => {
            throw new InvalidError(error);
          }),
        (error) => {
          throw new ValidationError(error);
        }
      )
      .then(() => {
        this.delivery.unloadRecord();
        this.args.model.reload();
        this.router.transitionTo('index');
        this.flashMessages.add({
          type: 'success',
          title: 'Successfully sent',
          message: `${capitalize(this.modelName)} sent.`,
          timeout: this.defaultTimeout
        });
      })
      .catch((error) =>
        this.flashMessages.add({
          type: 'error',
          title: error.name,
          message: htmlSafe(error.message),
          timeout: this.defaultTimeout
        })
      )
      .finally(() => this.loader.endLoading());
  }).drop())
  saveDeliveryTask;

  @(task(function* () {
    let client = yield this.args.model.belongsTo('client').load();
    let contacts = yield this.clients.contacts(client.get('id'));

    contacts = contacts.map(({ name, email }) => ({ name, email, kind: 'to' }));

    if (client.get('email')) {
      contacts.push({
        kind: 'to',
        name: client.get('name'),
        email: client.get('email')
      });
    }

    this.client = client;
    this.contacts = contacts;
  }).drop())
  fetchContactsTask;

  @(task(function* () {
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

    if (this.currentOrg.get('email')) {
      members.unshift({
        kind: 'cc',
        name: this.currentOrg.get('name'),
        email: this.currentOrg.get('email')
      });
    }

    this.members = members;
  }).drop())
  fetchMembersTask;
}
