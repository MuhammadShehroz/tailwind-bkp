import Controller from '@ember/controller';
import NewController from 'frontend/mixins/controllers/documents/new';
import FormBase from 'frontend/mixins/form-base';
import { empty } from '@ember/object/computed';

export default Controller.extend(NewController, FormBase, {
  reloadOrganization: empty('organization.current.invoiceTemplateCreatedAt'),

  saveChain(options) {
    return this.model.save().then(() => {
      this.transitionToRoute(options.successRedirectTo, this.model);
      this.metrics.trackEvent({
        event: `${this.model.modelName}_created`
      });

      this.flashMessages.add({
        type: 'success',
        title: 'Successfully saved.',
        message: `Invoice Template ${
          this.model.isDraft ? 'saved to drafts' : 'created'
        }.`,

        timeout: this.defaultTimeout
      });
    });
  },

  actions: {
    async fetchCountries() {
      this.set('countries', this.fetchCountries());
    },

    save() {
      this.save.perform({ successRedirectTo: 'invoice-templates.show' });
    }
  }
});
