import Controller from '@ember/controller';
import NewController from 'frontend/mixins/controllers/documents/new';
import FormBase from 'frontend/mixins/form-base';
import { computed } from '@ember/object';
import { empty } from '@ember/object/computed';

export default Controller.extend(NewController, FormBase, {
  queryParams: computed(function () {
    let result = this._super();
    let params = ['source_type', 'source_id'];
    result = result.concat(params);
    return result;
  }),

  sendMetricsEventAfterCreate: true,
  reloadOrganization: empty('organization.current.invoiceCreatedAt'),

  saveChain(options) {
    return this.model.save().then(() => {
      if (this.reloadOrganization) {
        this.forceOrganizationReload();
      }

      if (this.sendMetricsEventAfterCreate) {
        this.metrics.trackEvent({
          event: `${this.model.modelName}_created`
        });
      }

      this.transitionToRoute(options.successRedirectTo, this.model);

      this.flashMessages.add({
        type: 'success',
        title: 'Successfully saved.',
        message: `Invoice ${
          this.model.isDraft ? 'saved to drafts' : 'created'
        }.`,

        timeout: this.defaultTimeout
      });
    });
  },

  actions: {
    save() {
      this.save.perform({ successRedirectTo: 'invoices.show' });
    },

    saveAndPreview() {
      this.save.perform({ successRedirectTo: 'invoices.preview' });
    }
  }
});
