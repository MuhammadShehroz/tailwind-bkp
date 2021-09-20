import Mixin from '@ember/object/mixin';
import EmberObject, { computed } from '@ember/object';
import VirtualTax from 'frontend/models/virtual-tax';
import { TAX_DISTRIBUTIONS } from 'frontend/services/tax-distribution';
import { alias, gt, reads, equal, not, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import moment from 'moment';
import { pluralize } from 'ember-inflector';
import { task } from 'ember-concurrency';

export default Mixin.create({
  tagName: 'form',
  novalidate: true,
  store: service(),
  terms: service(),
  savedItem: service(),
  organization: service(),
  modals: service(),
  router: service(),
  metrics: service(),
  attributeBindings: ['novalidate'],

  lineItemsSectionIsExpanded: true,
  editMode: not('model.isNew'),
  lock: or('editMode', 'model.duplication'),

  hasLineItems: gt('lineItems.length', 0),
  lineItems: reads('model.lineItems'),

  lineTaxes: alias('model.taxes'),
  isLineTaxSingle: equal('lineTaxes.length', 1),
  paymentTerms: reads('terms.paymentTerms'),
  libraryItems: reads('savedItem.allItems'),
  itemsPresentOnLibrary: gt('libraryItems.length', 0),
  currentOrganization: reads('organization.current'),

  sortedLineItems: computed('lineItems.{[],@each.position}', function () {
    return this.lineItems.sortBy('position');
  }).readOnly(),

  storedTax: null,
  storedLineItemTaxes: null,

  init() {
    this._super(...arguments);
    this.set('newClients', A());
    this.terms.set('startDate', this.model.issuedOn);

    this.clientBasedDefaults = [
      'currency',
      'shipping',
      'hasLateFee',
      'lateFeeKind',
      'lateFeeInterval',
      'lateFee'
    ];
    this.clientBasedDefaults.forEach((attribute) => {
      this.set(`${attribute}Lock`, this.lock);
    });

    this.set('netTermsLock', this.lock);
    this.set('taxLock', this.lock);
    this.set('lateFee', this.lock);
  },

  selectClient(client) {
    this.model.set('client', client);
    this.send('changeDefaultsClientBased', client);
    this.newClients.unshiftObject(client);
  },

  paymentDueDate: computed('dueOn', 'model.{dueOn,netTerms}', 'paymentTerms', {
    get() {
      if (this.model.dueOn == null) {
        return;
      }

      let selectedTerm = this.terms.findTermByType(this.model.netTerms);
      let today = moment().utc().startOf('day');
      let todayImmediatelyTermDate =
        selectedTerm &&
        selectedTerm.value === 'immediately' &&
        today.isSame(this.model.dueOn);
      let netTerm = selectedTerm && selectedTerm.netLabel != null;
      if (todayImmediatelyTermDate || netTerm) {
        return selectedTerm;
      }

      return this.terms.otherTermWithCustomLabelDisplay(this.dueOn);
    },

    set(key, value) {
      if (value) {
        this.model.set('dueOn', value.date);
        this.model.set('netTerms', value.value);

        if (value.value === 'other') {
          this.element
            .querySelector('.payment-due-date .date-selector input')
            .click();
        }

        return value;
      } else {
        this.model.set('dueOn', null);
        this.model.set('netTerms', null);
      }

      return undefined;
    }
  }),

  dueOn: computed('model.dueOn', {
    get() {
      return this.model.dueOn;
    },

    set(key, value) {
      this.terms.otherTermWithCustomLabelDisplay(value);
      this.model.set('dueOn', value);

      return value;
    }
  }),

  issuedOn: computed('model.issuedOn', {
    get() {
      return this.model.issuedOn;
    },

    set(key, value) {
      this.model.set('issuedOn', value);
      this.terms.set('startDate', value);
      if (this.model.netTerms !== 'other') {
        let term = this.terms.findTermByType(this.model.netTerms);
        this.set('paymentDueDate', term);
      }

      return value;
    }
  }),

  otherTermDate: computed('model.{netTerms,dueOn}', function () {
    if (this.model.netTerms === 'other') {
      return this.model.dueOn;
    }

    return undefined;
  }),

  storeLineItemTaxes() {
    let storedLineItemsWithTax = this.model.lineItems.reduce(
      (lineItemsWithTax, lineItem) => {
        if (lineItem.get('calculatedTax')) {
          let lineItemWithTax = EmberObject.create({
            lineItem,
            storedTax: lineItem.get('calculatedTax')
          });
          lineItemsWithTax.push(lineItemWithTax);
        }

        return lineItemsWithTax;
      },
      []
    );

    this.set('storedLineItemTaxes', storedLineItemsWithTax);
  },

  restoreLineItemTaxes() {
    this.model.setLineItemTaxDistribution();

    this.storedLineItemTaxes.forEach((lineItemWithStoredTax) => {
      let lineItem = lineItemWithStoredTax.get('lineItem');
      let storedTax = lineItemWithStoredTax.get('storedTax');
      lineItem.set('calculatedTax', storedTax);
    });
  },

  clearStoredLineItemTaxes() {
    this.set('storedLineItemTaxes', null);
  },

  storeDocumentTax() {
    this.set('storedTax', this.model.calculatedTax);
  },

  restoreDocumentTax() {
    this.model.setDocumentTaxDistribution();
    this.set('model.calculatedTax', this.storedTax);
  },

  clearStoredDocumentTax() {
    this.set('storedTax', null);
  },

  loadItems(items) {
    items.forEach((item) => {
      let { lineItems } = this.model;
      let position = lineItems.get('length');

      lineItems.pushObject(item.convertToLineItem(this.model, position));
    });
  },

  defaultAttributeValue(client, attribute) {
    return client.get(attribute) || this.currentOrganization.get(attribute);
  },

  updateDueDate(client) {
    if (!this.netTermsLock) {
      let value = this.defaultAttributeValue(client, 'netTerms');
      let netTerm = this.terms.findTermByType(value);

      this.set('paymentDueDate', netTerm);
    }
  },

  rollbackTaxToOrganization(tax) {
    this.set('model.taxDistribution', this.currentOrganization.taxDistribution);
    this.set('model.calculatedTax', tax);
  },

  updateTaxBasedOnClient(client) {
    if (!this.taxLock) {
      client.get('tax').then((clientTax) => {
        this.currentOrganization.get('tax').then((organizationTax) => {
          let activeOrganizationTax =
            organizationTax && organizationTax.active ? organizationTax : null;
          let activeClientTax =
            clientTax && clientTax.active ? clientTax : null;
          let tax = activeClientTax || activeOrganizationTax;

          let virtualTax = VirtualTax.create({
            entity: tax
          });
          if (client.taxDistribution) {
            this.set('model.taxDistribution', client.taxDistribution);
            this.set('model.calculatedTax', virtualTax);
          } else {
            this.rollbackTaxToOrganization(virtualTax);
          }

          this.model.updateLineItemsOnTaxDistributionChange();
        });
      });
    }
  },

  updateLateFeeGroup(client) {
    if (!this.lateFeeLock) {
      let hasLateFee = this.defaultAttributeValue(client, 'hasLateFee');
      let lateFeeKind = this.defaultAttributeValue(client, 'lateFeeKind');
      let lateFeeInterval = this.defaultAttributeValue(
        client,
        'lateFeeInterval'
      );
      let lateFee = this.defaultAttributeValue(client, 'lateFee');

      this.setProperties({
        hasLateFee,
        lateFeeKind,
        lateFeeInterval,
        lateFee
      });
    }
  },

  reorderLineItems(lineItems) {
    let position = 0;

    lineItems.forEach((item) => {
      item.set('position', position);
      position += 1;
    });
  },

  getValidationErrorMessage(/* validations */) {
    let name =
      this.model.modelName === 'invoice-template'
        ? 'invoice'
        : this.model.modelName;
    return `The ${name || 'document'} is missing required data.`;
  },

  actions: {
    addLineItem() {
      this.model.addLineItem();
    },

    removeLineItem(lineItem) {
      this.model.removeLineItem(lineItem);
      this.reorderLineItems(this.lineItems);
    },

    reorderLineItems(lineItems) {
      this.reorderLineItems(lineItems);
    },

    async newClient() {
      let client = this.store
        .createRecord('client')
        .buildBillingAddress()
        .addContact();
      this.subregions = await this.fetchSubregions(
        client.billingAddress.country
      );
      this.modals.open('new-client', {
        model: client,
        controller: 'modals.new-client',
        countries: this.fetchCountries(),
        subregions: this.subregions,
        created: () => this.selectClient(client),
        cancelled: () => client.deleteRecord(),
        fetchSubregions: () =>
          this.fetchSubregions(client.billingAddress.country)
      });
    },

    showLineItems() {
      this.toggleProperty('lineItemsSectionIsExpanded');
    },

    handleOherSelected() {
      if (this.model.netTerms === 'other') {
        this.element
          .querySelector('.payment-due-date .date-selector input')
          .click();
      }
    },

    closeFlash() {
      this.clearStoredDocumentTax();
      this.clearStoredLineItemTaxes();
    },

    restoreLineItemTaxes() {
      this.restoreLineItemTaxes();
      this.send('closeFlash');
    },

    restoreDocumentTax() {
      this.restoreDocumentTax();
      this.send('closeFlash');
    },

    openItemLibrary() {
      this.modals.open('saved-items', {
        document: this.model,
        controller: 'modals.saved-items',
        loadItems: (items) => this.loadItems(items)
      });
    },

    changeDefaultsClientBased(client) {
      this.clientBasedDefaults.forEach((attribute) => {
        if (!this.get(`${attribute}Lock`)) {
          let value = this.defaultAttributeValue(client, attribute);

          this.model.set(attribute, value);
        }
      });

      this.updateDueDate(client);
      this.updateTaxBasedOnClient(client);
      this.updateLateFeeGroup(client);
    },

    lock(attribute) {
      this.set(`${attribute}Lock`, true);
    },

    storeTaxesBasedOnTaxDistribution(select) {
      let taxDistribution = select.get('value');

      if (taxDistribution !== TAX_DISTRIBUTIONS.TAX_FOR_ENTIRE_DOCUMENT) {
        this.storeDocumentTax();
      }

      if (taxDistribution !== TAX_DISTRIBUTIONS.TAX_PER_LINE_ITEM) {
        this.storeLineItemTaxes();
      }
    },

    saveAndSend() {
      this.saveAndSendTask.perform();
    },

    onStoredLineItemTaxesChange() {
      this.flashMessages.add({
        type: 'info',
        timeout: this.defaultTimeout,
        title: `Removed tax from entire ${this.model.modelName}`,
        message: `Applying tax to line items removes tax at the ${this.model.modelName} level.`,
        componentName: 'flash-messages/undo-button',
        componentContent: 'Undo doc',
        componentAction: () => this.restoreDocumentTax()
      });
    },

    onStoredTaxChange() {
      this.flashMessages.add({
        type: 'info',
        timeout: this.defaultTimeout,
        title: `Removed tax on ${this.storedLineItemTaxes.length} line items`,
        message: `You've cleared the ${this.model.modelName} Tax, which was assigned to ${this.storedLineItemTaxes.length} line items. Those line items have been set to "No Tax."`,
        componentName: 'flash-messages/undo-button',
        componentContent: 'Undo item',
        componentAction: () => this.restoreLineItemTaxes()
      });
    },

    openUnitOfMeasurementManager() {
      this.modals.open('unit-manager', {
        model: this.fetchUnits(),
        controller: 'modals.unit-manager',
        createUnit: this.createUnit
      });
    }
  },

  saveAndSendTask: task(function* () {
    let { isNew } = this.model;

    this.set('validationsEnabled', true);
    let { validations } = yield this.model.validate();
    if (!validations.isValid) return this.handleValidationError(validations);

    yield this.model.save();

    if (!this.currentOrganization.get(`${this.model.modelName}CreatedAt`)) {
      this.currentOrganization.reload();
    }

    if (isNew) {
      this.metrics.trackEvent({
        event: `${this.model.modelName}_created`
      });
    }

    this.router.transitionTo(
      `${pluralize(this.model.modelName)}.preview`,
      this.model
    );
  }).drop()
});
