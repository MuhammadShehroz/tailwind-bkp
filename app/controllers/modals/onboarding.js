import Controller from '@ember/controller';
import ModalController from 'frontend/mixins/controllers/modal';
import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';
import { task } from 'ember-concurrency';

const maxStepIndex = 4;

export default Controller.extend(ModalController, {
  store: service(),
  router: service(),
  metrics: service(),

  currentStepIndex: 0,
  validationsEnabled: false,
  maxStepIndex,

  isOnLastStep: equal('currentStepIndex', maxStepIndex).readOnly(),

  init() {
    this._super(...arguments);
    this.client = this.store.createRecord('client');
  },

  close() {
    this.client.hasDirtyAttributes && this.client.rollbackAttributes();
    this._super(...arguments);
  },

  actions: {
    async next() {
      switch (this.currentStepIndex) {
        case 0:
        case 1:
          this._gotoNextStep();
          break;
        case 2:
          if (await this._validateCurrentStep()) this._gotoNextStep();
          break;
        case 3:
          if (await this._validateCurrentStep()) this._saveClientTask.perform();
          break;
        default:
          break;
      }
    },

    linkTo() {
      this.close();
      next(this.router, 'transitionTo', ...arguments);
    },

    floatingActionClicked() {
      if (this.isOnLastStep) this.close();
      else if (this.currentStepIndex > 0)
        this.decrementProperty('currentStepIndex');
      this.set('validationsEnabled', false);
    },

    skipToDashboard() {
      this.close();
    }
  },

  _gotoNextStep() {
    this.set('validationsEnabled', false);
    this.incrementProperty('currentStepIndex');
  },

  async _validateCurrentStep() {
    this.set('validationsEnabled', true);
    let fields = [];

    if (this.currentStepIndex === 2) {
      fields = this.client.isCompany
        ? ['companyName']
        : ['firstName', 'lastName'];
    } else if (this.currentStepIndex === 3) {
      fields = ['email'];
    }

    let { validations } = await this.client.validate({ on: fields });

    return validations.get('isValid');
  },

  _saveClientTask: task(function* () {
    yield this.client.save();
    this.metrics.trackEvent({ event: 'client_added' });
    this._gotoNextStep();
  }).drop()
});
